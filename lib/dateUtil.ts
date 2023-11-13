import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(relativeTime);
dayjs.extend(advancedFormat);

export const formatDate = (dateStr: string) => {
  const today = dayjs();
  const eventDate = dayjs(dateStr);

  const daysDifference = today.diff(eventDate, "day");
  const hoursDifference = today.diff(eventDate, "hour");
  const minutesDifference = today.diff(eventDate, "minute");

  if (minutesDifference < 0) {
    return "In the future";
  }

  if (minutesDifference <= 0) {
    return "Just now";
  }

  if (minutesDifference < 60) {
    return `${minutesDifference} minute${
      minutesDifference === 1 ? "" : "s"
    } ago`;
  }

  if (hoursDifference < 24) {
    return `${hoursDifference} hour${hoursDifference === 1 ? "" : "s"} ago`;
  }

  if (daysDifference < 15) {
    return `${daysDifference} day${daysDifference === 1 ? "" : "s"} ago`;
  }

  return eventDate.format("MMM D, YYYY");
};

export const calendarDate = (dateStr: string) => {
  const eventDate = dayjs(dateStr);
  return eventDate.format("MMM D, YYYY");
};
