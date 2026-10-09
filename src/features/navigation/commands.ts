export type Command = {
  readonly id: string;
  readonly label: string;
  readonly detail: string;
  readonly tags?: readonly string[];
  readonly authors?: readonly string[];
  readonly execute: () => void;
};
export const destinations = [
  ["Home", "/"], ["Album", "/album"], ["Blog", "/blog"], ["Projects", "/projects"],
  ["Design", "/design"], ["About", "/about"], ["Management", "/management"],
  ["Theme Studio", "/design/theme-maker"], ["Notebook", "/notebook"], ["Christmas tree", "/christmas-tree"],
] as const;
