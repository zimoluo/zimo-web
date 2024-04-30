interface Props {
  title: string;
  count?: number;
}

export default function ColorCodeInputRow({ title, count = 1 }: Props) {
  return (
    <div className="flex space-x-3 items-center">
      <p className="whitespace-nowrap shrink-0">{title}</p>
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="w-full">
          <input className="rounded-md bg-pastel bg-opacity-80 py-1 px-1.5 w-full text-center" />
        </div>
      ))}
    </div>
  );
}
