import LocationPinIcon from "@/components/assets/entries/LocationPinIcon";
import InstagramLogo from "@/components/assets/sharing/InstagramLogo";
import { formatDate } from "@/lib/dateUtil";
import { enrichTextContent } from "@/lib/lightMarkUpProcessor";
import { formatLocation } from "@/lib/photos/helper";
import Image from "next/image";
import Link from "next/link";

type Props = {
  title: string;
  date: string;
  author: string;
  authorProfile: string;
  location?: LocationData;
  instagramLink?: string;
  shiftInstagramButton?: boolean;
};

export default function PhotosTitleCard({
  title,
  location,
  date,
  author,
  authorProfile,
  instagramLink,
  shiftInstagramButton = false,
}: Props) {
  return (
    <div>
      <div className="flex text-primary items-center">
        <div className="flex justify-center items-center w-10 h-auto mr-4">
          <div className="w-full h-auto rounded-full overflow-hidden flex justify-center items-center">
            <Image
              src={authorProfile}
              alt={`${author}'s Profile`}
              className="h-full w-10"
              width={40}
              height={40}
            />
          </div>
        </div>

        <div className="grid grid-rows-2">
          <div className="flex justify-start items-center">
            <p className="text-base">{author}</p>
          </div>
          <div className="flex justify-start items-center">
            {location && (
              <LocationPinIcon className="h-4 w-auto aspect-square mr-1 opacity-75" />
            )}
            <p className="text-saturated text-sm opacity-80">
              {`${location ? `${formatLocation(location)} · ` : ""}${formatDate(
                date
              )}`}
            </p>
          </div>
        </div>

        {instagramLink && (
          <div className="flex-grow flex justify-end items-start self-start gap-2">
            <Link
              target="_blank"
              rel="noreferrer"
              href={instagramLink}
              className={`${shiftInstagramButton ? "-translate-y-1" : ""}`}
            >
              <InstagramLogo
                className="w-6 h-auto aspect-square"
                isPhotosPage={true}
              />
            </Link>
            {shiftInstagramButton && (
              <div
                className="w-6 h-0 pointer-events-none select-none touch-none"
                aria-hidden="true"
              />
            )}
          </div>
        )}
      </div>
      <p className="text-lg mt-2">{enrichTextContent(title)}</p>
    </div>
  );
}
