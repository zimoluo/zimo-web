interface Props {
  url: string;
}

export default function WindowIFrame({ url }: Props) {
  return <iframe src={url} className="w-full h-full" />;
}
