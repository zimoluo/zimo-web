type Props = {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
};

export default function ImagePageIndicator({
  totalPages,
  currentPage,
  onPageChange,
}: Props) {
  const isCompactView = totalPages > 12;
  return (
    <div
      className={`flex ${
        isCompactView ? "space-x-1 md:space-x-2" : "space-x-1.5 md:space-x-2"
      }`}
    >
      {Array.from({ length: totalPages }).map((_, index) => (
        <button
          key={index}
          className={`${
            isCompactView ? "w-1.5 md:w-2" : "w-2"
          } rounded-full h-auto aspect-square ${
            index === currentPage
              ? "bg-neutral-100 bg-opacity-80"
              : "bg-neutral-800 bg-opacity-40"
          }`}
          onClick={() => {
            if (index === currentPage) {
              return;
            }
            onPageChange(index);
          }}
        ></button>
      ))}
    </div>
  );
}
