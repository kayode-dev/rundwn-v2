import { cn } from "@/lib/utils";
import {
  Disc2,
  History,
  ListMusic,
  LucideIcon,
  Mic,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavProps {
  name: string;
  href: string;
  icon: LucideIcon;
}
const NAV_LINKS: NavProps[] = [
  { name: "Home", href: "/app", icon: UserRound },
  { name: "Artists", href: "/app/artists", icon: Mic },
  { name: "Tracks", href: "/app/tracks", icon: Disc2 },
  { name: "Recents", href: "/app/recents", icon: History },
  { name: "Playlists", href: "/app/playlists", icon: ListMusic },
];

const NavLink = ({ name, href, icon }: NavProps) => {
  const pathname = usePathname();
  const isActive = pathname == href;
  const Icon = icon;
  return (
    <Link
      href={href}
      className={cn(
        "box-border h-full md:h-max border-b-4 md:border-b-0 border-transparent md:border-l-4 p-2 md:p-4 flex flex-col justify-between gap-2 md:gap-4 hover:border-green-600 hover:bg-neutral-800 items-center w-full transition-colors duration-300 ease-in",
        {
          "border-neu-green bg-neutral-800": isActive,
        }
      )}
    >
      <Icon />
      <p className="text-xs md:text-base">{name}</p>
    </Link>
  );
};
export const Navbar = () => {
  return (
    <div className="fixed w-full h-16 md:h-dvh bottom-0 md:top-0 left-0 z-20 flex md:flex-col items-center justify-center md:w-28 bg-neutral-950">
      {NAV_LINKS.map((nav) => (
        <NavLink key={nav.name} {...nav} />
      ))}
    </div>
  );
};
