import {
  fetchAllEntries,
  fetchEntryBySlug,
} from "@/lib/dataLayer/server/awsEntryFetcher";
import { ReactNode } from "react";
import PhotosWindow from "../PhotosWindow";
import MobileDesktopEntryRenderer from "@/components/widgets/MobileDesktopEntryRenderer";
import PhotosTitleCard from "../PhotosTitleCard";
import ImageViewer from "@/components/widgets/ImageViewer";
import CommentAreaWrapper from "@/components/comments/CommentAreaWrapper";
import { CommentProvider } from "@/components/contexts/CommentContext";
import { getComments } from "@/lib/dataLayer/server/commentManager";
import PhotosCommentTypingBar from "../PhotosCommentTypingBar";
import EntryLikeButtonInitializer from "@/components/comments/EntryLikeButtonInitializer";
import CommentCardContainer from "@/components/comments/CommentCardContainer";
import ReadingBlur from "@/components/widgets/ReadingBlur";
import { Metadata } from "next";
import { generateFilterRobotsMeta } from "@/lib/siteMetadata";

interface Props {
  children?: ReactNode;
  params: Promise<{ slug: string }>;
}

const fetchDir = "photos/entries";

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const entry = (await fetchEntryBySlug(params.slug, fetchDir, "json", [
    "title",
    "date",
    "author",
    "authorProfile",
    "slug",
    "location",
    "images",
    "instagramLink",
    "unlisted",
  ])) as PhotosEntry & { unlisted?: boolean };

  return {
    title: `${entry.title} | Album - Zimo Web`,
    openGraph: {
      type: "article",
      title: entry.title,
      url: `/photos/${entry.slug}`,
      images: [{ url: entry.images.url[0] }],
    },
    twitter: {
      card: "summary_large_image",
      title: entry.title,
      images: entry.images.url[0],
    },
    keywords: "Zimo Web, Zimo Luo, Photos, Album, Personal Website",
    robots: generateFilterRobotsMeta(entry.unlisted),
  };
}

export const revalidate = 24;

export default async function PhotosEntryLayout(props: Props) {
  const params = await props.params;

  const { children } = props;

  const { slug } = params;

  const entry = (await fetchEntryBySlug(slug, fetchDir, "json", [
    "title",
    "date",
    "author",
    "authorProfile",
    "slug",
    "location",
    "images",
    "instagramLink",
  ])) as PhotosEntry;

  return (
    <MobileDesktopEntryRenderer
      desktop={<PhotosWindow {...entry} />}
      mobile={
        <>
          <ReadingBlur />
          <article className="pt-16 px-5 pb-6 bg-widget-80">
            <PhotosTitleCard {...entry} />
            <div className="-mt-8">
              <ImageViewer {...entry.images} forceGridViewCenter={false} />
            </div>

            <div className="my-8">
              <CommentProvider
                location={`photos/comments/${entry.slug}.json`}
                initialComments={await getComments(
                  `photos/comments/${entry.slug}.json`
                )}
                likeIconType="heart"
              >
                <PhotosCommentTypingBar
                  inMiddle={true}
                  likeButton={
                    <EntryLikeButtonInitializer
                      resourceLocation={`photos/likedBy/${entry.slug}.json`}
                      likeIconType="heart"
                    />
                  }
                />
                <CommentAreaWrapper>
                  <div
                    aria-hidden="true"
                    className="pointer-events-none select-none h-8"
                  />
                  <CommentCardContainer />
                </CommentAreaWrapper>
              </CommentProvider>
            </div>
          </article>
        </>
      }
    />
  );
}

export async function generateStaticParams() {
  const entries = await fetchAllEntries(fetchDir, "json", ["slug"]);

  return entries.map((entry) => {
    return {
      slug: entry.slug as string,
    };
  });
}
