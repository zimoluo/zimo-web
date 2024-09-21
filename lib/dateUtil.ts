import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(relativeTime);
dayjs.extend(advancedFormat);

export const formatDate = (
  dateStr: string,
  capitalize = true,
  hasPreposition = false
) => {
  const today = dayjs();
  const eventDate = dayjs(dateStr);

  const daysDifference = today.diff(eventDate, "day");
  const hoursDifference = today.diff(eventDate, "hour");
  const minutesDifference = today.diff(eventDate, "minute");

  let formattedDate = "";

  if (minutesDifference < 0) {
    formattedDate = "in the future";
  } else if (minutesDifference <= 0) {
    formattedDate = "just now";
  } else if (minutesDifference < 60) {
    formattedDate = `${minutesDifference} minute${
      minutesDifference === 1 ? "" : "s"
    } ago`;
  } else if (hoursDifference < 24) {
    formattedDate = `${hoursDifference} hour${
      hoursDifference === 1 ? "" : "s"
    } ago`;
  } else if (daysDifference < 15) {
    formattedDate = `${daysDifference} day${
      daysDifference === 1 ? "" : "s"
    } ago`;
  } else {
    formattedDate = eventDate.format("MMM D, YYYY");
    formattedDate = `${hasPreposition ? "on " : ""}${formattedDate}`;
  }

  if (capitalize) {
    formattedDate =
      formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  }

  return formattedDate;
};

export const calendarDate = (dateStr: string) => {
  const eventDate = dayjs(dateStr);
  return eventDate.format("MMM D, YYYY");
};
