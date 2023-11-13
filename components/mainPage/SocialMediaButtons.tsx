import Link from "next/link";
import DiscordLogo from "../images/sharing/DiscordLogo";
import GitHubLogo from "../images/sharing/GitHubLogo";
import InstagramLogo from "../images/sharing/InstagramLogo";
import RedditLogo from "../images/sharing/RedditLogo";
import TwitterLogo from "../images/sharing/TwitterLogo";

const socialMedia = [
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
    <section className="flex space-x-2.5 text-2xl mt-8 -mb-16">
      <div
        className="flex-grow select-none pointer-events-none"
        aria-hidden="true"
      />
      {socialMedia.map((platform) => (
        <Link key={platform.name} href={platform.url} target="_blank">
          <platform.icon className="w-8 h-auto aspect-square transition-transform duration-300 ease-in-out hover:scale-110" />
        </Link>
      ))}
    </section>
  );
}
