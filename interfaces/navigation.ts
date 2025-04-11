type NavigationKey =
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

type ArticleCardProps = ArticleCardData & ArticleCardDisplay;

interface ArticleCardData {
  section: EntrySection;
  slug: string;
  useCalendarDate?: boolean;
  omitSectionType?: boolean;
}

interface ArticleCardDisplay {
  title: string;
  description?: string;
  date: string;
}

type EntrySection = "photos" | "blog" | "projects" | "management";

type SharingPlatform =
  | "mobile"
  | "facebook"
  | "twitter"
  | "linkedin"
  | "copy"
  | "reddit"
  | "download"
  | "bsky";

type MenuUtility =
  | "logOut"
  | "resetSettings"
  | "deleteAccount"
  | "manuallyDownloadSettings"
  | "resetProfiles"
  | "resetAllData";
