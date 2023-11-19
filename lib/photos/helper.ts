export function formatLocation(location: LocationData): string {
  if (location.name) {
    return location.name.trim();
  }

  let lat: string = location.latitude.toFixed(2);
  let long: string = location.longitude.toFixed(2);

  const latDecimalPoints = (location.latitude.toString().split(".")[1] || "")
    .length;
  const longDecimalPoints = (location.longitude.toString().split(".")[1] || "")
    .length;
  const decimalPoints = Math.min(latDecimalPoints, longDecimalPoints, 2);

  lat = location.latitude.toFixed(decimalPoints);
  long = location.longitude.toFixed(decimalPoints);

  const latDirection = location.latitude >= 0 ? "N" : "S";
  const longDirection = location.longitude >= 0 ? "E" : "W";

  return `${Math.abs(parseFloat(lat))}°${latDirection}, ${Math.abs(
    parseFloat(long)
  )}°${longDirection}`;
}
