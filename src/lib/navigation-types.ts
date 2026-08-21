export type NavigationKey =
  | "home"
  | "photos"
  | "blog"
  | "projects"
  | "about"
  | "management"
  | "design"
  | "themeMaker"
  | "notebook"
  | "christmasTree";

export type ArticleCardProps = ArticleCardData & ArticleCardDisplay;

export interface ArticleCardData {
  section: EntrySection;
  slug: string;
  useCalendarDate?: boolean;
  omitSectionType?: boolean;
}

export interface ArticleCardDisplay {
  title: string;
  description?: string;
  date: string;
}

export type EntrySection = "photos" | "blog" | "projects" | "management";

export type SharingPlatform =
  | "mobile"
  | "facebook"
  | "twitter"
  | "linkedin"
  | "copy"
  | "reddit"
  | "download"
  | "bsky"
  | "rss";

export type MenuUtility =
  | "logOut"
  | "resetSettings"
  | "deleteAccount"
  | "manuallyDownloadSettings"
  | "resetProfiles"
  | "resetAllData";
