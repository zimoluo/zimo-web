interface ArticleCardProps {
  title: string;
  description?: string;
  section: "photos" | "blog" | "projects" | "management";
  slug: string;
  date?: string;
  useCalendarDate?: boolean;
  omitSectionType?: boolean;
}
