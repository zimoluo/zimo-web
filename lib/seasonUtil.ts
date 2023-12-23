export const monthNames: Month[] = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

export const isWithinDateRange = (date: Date, range: DateRange): boolean => {
  const startMonth = monthNames.indexOf(range.start.month);
  const endMonth = monthNames.indexOf(range.end.month);

  if (startMonth === -1 || endMonth === -1) {
    console.error("Invalid month name in date range");
    return false;
  }

  const startDate = new Date(date.getFullYear(), startMonth, range.start.day);
  const endDate = new Date(date.getFullYear(), endMonth, range.end.day);

  return date >= startDate && date <= endDate;
};

export const isHalloweenSeason = (): boolean => {
  const range: DateRange = {
    start: { month: "october", day: 15 },
    end: { month: "november", day: 5 },
  };
  return isWithinDateRange(new Date(), range);
};

export const isHalloweenDay = (): boolean => {
  const date = new Date();
  const month = monthNames[date.getMonth()];
  const day = date.getDate();
  return month === "october" && day === 31;
};

export const isBirthday = (): boolean => {
  const range: DateRange = {
    start: { month: "november", day: 26 },
    end: { month: "november", day: 28 },
  };
  return isWithinDateRange(new Date(), range);
};

export const isChristmas = (): boolean => {
  const range: DateRange = {
    start: { month: "december", day: 23 },
    end: { month: "december", day: 31 },
  };
  return isWithinDateRange(new Date(), range);
};
