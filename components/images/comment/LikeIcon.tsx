import HeartFilledIcon from "./likeButtons/HeartFilledIcon";
import HeartIcon from "./likeButtons/HeartIcon";
import StarFilledIcon from "./likeButtons/StarFilledIcon";
import StarIcon from "./likeButtons/StarIcon";
import ThumbsUpIcon from "./likeButtons/ThumbsUp";
import ThumbsUpFilledIcon from "./likeButtons/ThumbsUpFilled";

interface Props {
  likeIconType?: LikeIconType;
  filled?: boolean;
  className?: string;
  color?: HexColor | null;
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
  color,
}: Props) {
  const LikeIconMapped =
    likeIconTable[likeIconType][filled ? "filled" : "empty"];

  return <LikeIconMapped color={color} className={className} />;
}
