
import { SurfaceRim } from "../../../ui/SurfaceRim";
import Link from "next/link";
import DiscordLogo from "../../../ui/icons/sharing/DiscordLogo";
import EmailIcon from "../../../ui/icons/sharing/EmailIcon";
import GitHubLogo from "../../../ui/icons/sharing/GitHubLogo";
import InstagramLogo from "../../../ui/icons/sharing/InstagramLogo";
import RedditLogo from "../../../ui/icons/sharing/RedditLogo";
import TwitterLogo from "../../../ui/icons/sharing/TwitterLogo";
import LinkedinLogo from "../../../ui/icons/sharing/LinkedinLogo";

const socialMedia = [
  {
    name: "Email",
    url: "mailto:abgkings0920@gmail.com",
    icon: EmailIcon,
  },
  {
    name: "Github",
    url: "https://github.com/zimoluo",
    icon: GitHubLogo,
  },
  {
    name: "Reddit",
    url: "https://www.reddit.com/user/g2245820920",
    icon: RedditLogo,
  },
  {
    name: "Discord",
    url: "https://discord.com/users/465654991970107404",
    icon: DiscordLogo,
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/zimo-luo/",
    icon: LinkedinLogo,
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/zeemoluo/",
    icon: InstagramLogo,
  },
  {
    name: "Twitter",
    url: "https://twitter.com/WhiteGkings",
    icon: TwitterLogo,
  },
];

export default function SocialMediaButtons() {
  return (
    <div className="flex mt-8 -mb-16">
      <div
        className="grow select-none pointer-events-none"
        aria-hidden="true"
      />
      <section className="flex gap-3 surface-edge surface-edge-saturated rounded-full p-3 backdrop-blur-xs surface-widget surface-widget-60 shadow-md">
        {socialMedia.map((platform) => (
          <Link key={platform.name} href={platform.url} target="_blank" rel="noopener noreferrer" aria-label={platform.name}>
            <platform.icon className="w-8 h-auto aspect-square transition-transform duration-300 ease-in-out hover:scale-110" />
          </Link>
        ))}
      <SurfaceRim /></section>
    </div>
  );
}
