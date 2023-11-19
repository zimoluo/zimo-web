import { awsBucketAddress } from "../constants/awsConfig";

export const getProjectFavicon = (slug: string, faviconFormat: string) => {
  return `${awsBucketAddress}/projects/favicon/${slug}.${faviconFormat}`;
};
