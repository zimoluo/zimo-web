import type { IconProps } from "@/src/ui/icons";
type LikeIconType = "generic" | "star" | "heart";
import HeartFilledIcon from "./likeButtons/HeartFilledIcon";
import HeartIcon from "./likeButtons/HeartIcon";
import StarFilledIcon from "./likeButtons/StarFilledIcon";
import StarIcon from "./likeButtons/StarIcon";
import ThumbsUpIcon from "./likeButtons/ThumbsUp";
import ThumbsUpFilledIcon from "./likeButtons/ThumbsUpFilled";

type Props = IconProps & {
  likeIconType?: LikeIconType;
  filled?: boolean;
  className?: string;
}

const likeIconTable: Record<
  LikeIconType,
  Record<"empty" | "filled", typeof ThumbsUpIcon>
> = {
  generic: {
    empty: ThumbsUpIcon,
    filled: ThumbsUpFilledIcon,
  },
  star: {
    empty: StarIcon,
    filled: StarFilledIcon,
  },
  heart: {
    empty: HeartIcon,
    filled: HeartFilledIcon,
  },
};

export default function LikeIcon({
  likeIconType = "generic",
  filled = false,
  className = "",
  size,
  strokeWidth,
}: Props) {
  const LikeIconMapped =
    likeIconTable[likeIconType][filled ? "filled" : "empty"];

  return <LikeIconMapped size={size} className={className} strokeWidth={strokeWidth} />;
}
