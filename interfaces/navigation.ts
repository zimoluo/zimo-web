type NavigationKey =
  | "home"
  | "photos"
  | "blog"
  | "projects"
  | "about"
  | "management";

interface ArticleCardProps {
  title: string;
  description?: string;
  section: EntrySection;
  slug: string;
  date?: string;
  useCalendarDate?: boolean;
  omitSectionType?: boolean;
}

type EntrySection = "photos" | "blog" | "projects" | "management";

type SharingPlatform =
  | "mobile"
  | "facebook"
  | "twitter"
  | "linkedin"
  | "copy"
  | "reddit"
  | "download";

type MenuUtility =
  | "logOut"
  | "resetSettings"
  | "deleteAccount"
  | "clearCachedUserData";
