import type { ImagesData } from "./entry";
export interface PhotosEntry {
  title: string;
  date: string;
  author: string;
  authorProfile: string;
  slug: string;
  location?: LocationData;
  images: ImagesData;
  instagramLink?: string;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  name?: string;
}
