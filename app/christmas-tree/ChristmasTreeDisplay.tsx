import Image from "next/image";
import treeStyle from "./tree.module.css";
import { getRawDataFromServer } from "@/lib/dataLayer/server/awsEntryFetcher";

export default async function ChristmasTreeDisplay() {
  const { treeContent: treeData } = (await getRawDataFromServer(
    "special/christmas/tree.json",
    "json"
  )) as { treeContent: TreeContent[] };

  return (
    <div
      className={`${treeStyle.aspect} w-full h-auto relative`}
      id="christmas-tree-container"
    >
      <Image
        src="/special/christmas/tree.svg"
        className="w-full h-full"
        alt="Christmas tree"
        height={500}
        width={330}
      />
      {treeData.map(({ position, sprite, date }, index) => (
        <Image
          key={`${date}-${sprite}-${index}`}
          src={`https://zimo-web-bucket.s3.us-east-2.amazonaws.com/special/christmas/public/sprites/${sprite}.svg`}
          alt={sprite}
          className="-translate-x-1/2 -translate-y-1/2 h-auto aspect-square absolute"
          style={{
            left: `${position[0] / 10}%`,
            top: `${position[1] / 10}%`,
            width: "18%",
          }}
          height="100"
          width="100"
        />
      ))}
    </div>
  );
}

export const revalidate = 0;
