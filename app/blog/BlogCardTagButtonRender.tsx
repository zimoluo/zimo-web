interface Props {
  tag: string;
}

export default function BlogCardTagButtonRender({ tag }: Props) {
  return (
    <span className="inline-block bg-saturated rounded-full px-2 py-0.25 md:py-0.5 text-xs md:text-sm font-bold text-light transition-transform duration-300 ease-in-out hover:scale-105 text-center">
      {tag}
    </span>
  );
}
