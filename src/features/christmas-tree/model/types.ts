export interface TreeContent {
  from: string;
  message: string;
  position: [number, number];
  sprite: string;
  date: string;
  isPublic?: boolean;
  neverShowSpoilerWarning?: boolean;
  uniqueId: string;
}

export interface TreeSelection {
  hasSelected: boolean;
  sprite: string;
}
