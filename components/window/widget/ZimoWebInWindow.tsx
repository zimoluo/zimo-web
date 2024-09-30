import { baseUrl } from "@/lib/constants/navigationFinder";

export default function ZimoWebInWindow() {
  return <iframe src={baseUrl} className="w-full h-full"></iframe>;
}
