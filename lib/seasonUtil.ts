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

  const startDate = new Date(
    date.getFullYear(),
    startMonth,
    range.start.day,
    0,
    0,
    0
  );
  const endDate = new Date(
    date.getFullYear(),
    endMonth,
    range.end.day,
    23,
    59,
    59
  );

  return date >= startDate && date <= endDate;
};

export const isHalloween = (): boolean => {
  const range: DateRange = {
    start: { month: "october", day: 15 },
    end: { month: "october", day: 31 },
  };
  return isWithinDateRange(new Date(), range);
};

export const isChatGPTDay = (): boolean => {
  const range: DateRange = {
    start: { month: "november", day: 30 },
    end: { month: "november", day: 30 },
  };
  return isWithinDateRange(new Date(), range);
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
    end: { month: "december", day: 30 },
  };
  return isWithinDateRange(new Date(), range);
};

export const isNewYear = (): boolean => {
  const range: DateRange = {
    start: { month: "december", day: 31 },
    end: { month: "december", day: 31 },
  };
  const altRange: DateRange = {
    start: { month: "january", day: 1 },
    end: { month: "january", day: 1 },
  };
  return (
    isWithinDateRange(new Date(), range) ||
    isWithinDateRange(new Date(), altRange)
  );
};

export const isZimoWebDay = (): boolean => {
  const range: DateRange = {
    start: { month: "october", day: 26 },
    end: { month: "october", day: 28 },
  };
  return isWithinDateRange(new Date(), range);
};
