import ReadingContentProcessor from "@/components/widgets/ReadingContentProcessor";
import Image from "next/image";

export default function BlogReader(post: PostEntry) {
  return (
    <>
      <hr className="my-10 border-saturated border-t opacity-50" />
      {post.coverImage && post.displayCover ? (
        <div className="flex justify-center items-center mb-12">
          <Image
            src={post.coverImage}
            alt={`Cover of ${post.title}`}
            width={384}
            height={384}
            className="h-auto w-full object-cover max-h-96 rounded-xl"
          />
        </div>
      ) : null}
      <ReadingContentProcessor isBlog={true}>
        {post.content}
      </ReadingContentProcessor>
    </>
  );
}
