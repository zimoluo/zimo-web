import { awsBucket, awsBucketRegion } from "@/lib/constants/awsConfig";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { OAuth2Client } from "google-auth-library";
import "server-only";
import { promisify } from "util";
import * as zlib from "zlib";
import { Readable } from "stream";
import { pipeline } from "stream/promises";
import jwt from "jsonwebtoken";

const securityDataShutDown =
  process.env.NEXT_PUBLIC_ZIMO_WEB_DATA_SHUTDOWN === "true";

const googleClientId = process.env.NEXT_PUBLIC_ZIMO_WEB_GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.ZIMO_WEB_GOOGLE_CLIENT_SECRET;

const awsKeyId = process.env.ZIMO_WEB_AWS_KEY_ID;
const awsSecretKey = process.env.ZIMO_WEB_AWS_SECRET_KEY;

if (!awsKeyId) {
  throw new Error("AWS_KEY_ID is undefined!");
}

if (!awsSecretKey) {
  throw new Error("AWS_SECRET_KEY_ZIMO_WEB is undefined!");
}

const s3 = new S3Client({
  region: awsBucketRegion,
  credentials: {
    accessKeyId: awsKeyId,
    secretAccessKey: awsSecretKey,
  },
});

const gzip = promisify(zlib.gzip);

export async function getUserByPayload(
  payload: AccountPayloadData,
  localSettingsData: SettingsState
) {
  if (securityDataShutDown) {
    console.error("Server is under maintenance.");
    return null;
  }

  let profilePic = payload.profilePic;
  let userName = payload.name;
  let userState = "normal";
  const userSub = payload.sub;
  let userSettings = localSettingsData.syncSettings ? localSettingsData : null;

  if (!(await checkIfUserExistsBySub(userSub))) {
    // Creating account data on server. Respects syncSettings option.
    const user = {
      profilePic: profilePic,
      name: userName,
      state: userState,
      websiteSettings: userSettings,
    } as unknown as UserData;
    await uploadUserToServer(user, userSub);
  } else {
    // Downloading data from the server. Respects syncSettings option.
    const downloadedUser = await getUserDataBySub(userSub, [
      "name",
      "profilePic",
      "state",
      "websiteSettings",
    ]);

    if (downloadedUser === null) {
      console.error("Failed to download user data.");
      return null;
    }

    userName = downloadedUser.name;
    profilePic = downloadedUser.profilePic;
    userState = downloadedUser.state as UserState;
    userSettings = localSettingsData.syncSettings
      ? downloadedUser.websiteSettings
      : null;
  }

  const fetchedUser = {
    name: userName,
    profilePic: profilePic,
    sub: userSub,
    state: userState,
    websiteSettings: userSettings,
  } as UserData;

  return fetchedUser;
}

export async function fetchDecodedToken(
  codeAuth: string
): Promise<AccountPayloadData | null> {
  if (!codeAuth) {
    console.error("Authenticate code is missing");
    return null;
  }

  try {
    const client = new OAuth2Client(
      googleClientId,
      googleClientSecret,
      "postmessage"
    );
    const { tokens } = await client.getToken(codeAuth);
    const idToken = tokens.id_token;
    if (!idToken) {
      throw new Error("Invalid id token!");
    }

    const ticket = await client.verifyIdToken({
      idToken: idToken,
      audience: googleClientId,
    });
    const payload = ticket.getPayload();

    if (!payload) {
      throw new Error("Failed to verify token.");
    }

    const fetchedName = payload.name || "Anonymous";
    const fetchedPicture = payload.picture || "/favicon.svg";

    const securePayload: AccountPayloadData = {
      name: fetchedName,
      profilePic: fetchedPicture,
      sub: payload.sub,
    };

    return securePayload;
  } catch (error) {
    console.error("Error fetching decoded token:", error);
    return null;
  }
}

export async function checkIfUserExistsBySub(sub: string): Promise<boolean> {
  const directory = "account/users";
  const params = {
    Bucket: awsBucket,
    Key: `${directory}/${sub}.json`,
  };

  try {
    if (securityDataShutDown) {
      throw new Error("Server is under maintenance.");
    }

    const command = new HeadObjectCommand(params);
    await s3.send(command);
    return true;
  } catch (err: any) {
    if (err.name === "NotFound" || err.code === "NotFound") {
      return false;
    }

    throw err;
  }
}

export async function uploadUserToServer(
  user: Omit<UserData, "sub">,
  sub: string
): Promise<{ success: boolean; message: string }> {
  try {
    if (securityDataShutDown) {
      throw new Error("Server is under maintenance.");
    }

    // Convert user to JSON string and compress it using gzip
    const directory = "account/users";
    const compressedUser = await gzip(JSON.stringify(user));

    const params = {
      Bucket: awsBucket,
      Key: `${directory}/${sub}.json`,
      Body: compressedUser,
      ContentEncoding: "gzip",
      ContentType: "application/json",
    };

    const command = new PutObjectCommand(params);
    await s3.send(command);
    return { success: true, message: "User data successfully uploaded." };
  } catch (err: any) {
    console.error(`Failed to upload user data. Error: ${err}`);
    return {
      success: false,
      message: `Failed to upload user data. Error: ${err}`,
    };
  }
}

export async function getUserDataBySub(
  sub: string,
  fields: string[] = []
): Promise<{ [key: string]: any }> {
  if (securityDataShutDown) {
    throw new Error("Server is under maintenance.");
  }

  const directory = "account/users";
  const params = {
    Bucket: awsBucket,
    Key: `${directory}/${sub}.json`,
  };
  const command = new GetObjectCommand(params);
  const s3Object = await s3.send(command);

  if (!s3Object.Body) {
    throw new Error("Failed to fetch entry content from S3");
  }

  let fileContents = "";
  const isGzipped = s3Object.ContentEncoding === "gzip";

  await pipeline(
    s3Object.Body as Readable,
    isGzipped ? zlib.createGunzip() : (source) => source,
    async function* (source) {
      for await (const chunk of source) {
        fileContents += chunk.toString("utf-8");
      }
    }
  );

  const data = JSON.parse(fileContents);
  const items: { [key: string]: any } = {};

  fields.forEach((field) => {
    if (typeof data[field] !== "undefined") {
      items[field] = data[field];
    }
  });

  return items;
}

export const getSubFromSessionToken = (sessionToken: string) => {
  const secretKey = process.env.ZIMO_WEB_JWT_KEY;

  if (!secretKey) {
    throw new Error("JWT_KEY is undefined!");
  }

  try {
    const decodedToken = jwt.verify(sessionToken, secretKey);
    return decodedToken.sub as string;
  } catch (error) {
    return null;
  }
};

export async function deleteUserFile(
  sub: string
): Promise<{ success: boolean; message: string }> {
  if (securityDataShutDown) {
    console.error("Server is under maintenance.");
    return {
      success: false,
      message: "Server is under maintenance.",
    };
  }

  const directory = "account/users";

  const params = {
    Bucket: awsBucket,
    Key: `${directory}/${sub}.json`,
  };

  const command = new DeleteObjectCommand(params);
  try {
    await s3.send(command);
    return { success: true, message: "User data successfully deleted." };
  } catch (err: any) {
    return {
      success: false,
      message: `Failed to delete user data. Error: ${err}`,
    };
  }
}
