import { ReactNode } from "react";

interface Props {
  params: { tag: string };
  children?: ReactNode;
}

export default function BlogTagLayout({ params, children }: Props) {}
