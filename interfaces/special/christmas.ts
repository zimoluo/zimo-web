interface TreeContent {
  from: string;
  message: string;
  position: [number, number];
  sprite: string;
  date: string;
  isPublic?: boolean;
}

interface TreeSelection {
  hasSelected: boolean;
  sprite: string;
}
