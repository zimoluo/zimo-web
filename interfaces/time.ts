type Month =
  | "january"
  | "february"
  | "march"
  | "april"
  | "may"
  | "june"
  | "july"
  | "august"
  | "september"
  | "october"
  | "november"
  | "december";

type DateRange = {
  start: { month: Month; day: number };
  end: { month: Month; day: number };
};
