import {
  getTreeContentFromServer,
  uploadTreeContentToServer,
} from "@/lib/dataLayer/server/specialServiceManager";
import { isTreeContentPositionValid } from "@/lib/special/christmasTreeHelper";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
  try {
    const { treeContentData } = await request.json();

    if (
      !treeContentData.from ||
      treeContentData.from.trim().length === 0 ||
      !treeContentData.message ||
      treeContentData.message.trim().length === 0
    )
      throw new Error("Invalid tree content data!");
    if (treeContentData.from.length > 500) throw new Error("Name is too long!");
    if (treeContentData.message.length > 4000)
      throw new Error("Message is too long!");

    const downloadedTreeContent = await getTreeContentFromServer();

    if (
      !isTreeContentPositionValid(
        treeContentData.position,
        downloadedTreeContent
      )
    )
      throw new Error("Invalid position!");

    treeContentData.date = new Date().toISOString();
    treeContentData.neverShowSpoilerWarning = undefined; // is not meant to be set (defaults to false). save some space.
    treeContentData.uniqueId = uuidv4();

    const updatedTreeContent = [
      ...downloadedTreeContent,
      treeContentData as TreeContent,
    ];

    await uploadTreeContentToServer(updatedTreeContent);

    return new Response(JSON.stringify({ success: true, updatedTreeContent }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "https://tree.zimoluo.me",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Credentials": "true",
      },
    });
  } catch (error: any) {
    console.error("Error adding tree content:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "https://tree.zimoluo.me",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Credentials": "true",
      },
    });
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "https://tree.zimoluo.me",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Credentials": "true",
    },
  });
}
