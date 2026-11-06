interface SiteSearchEntry {
  section: EntrySection;
  slug: string;
  title: string;
  description: string;
  tags: string[];
  authors: string[];
  date: string;
}

interface SiteSearchIndex {
  entries: SiteSearchEntry[];
  unavailable: EntrySection[];
}
