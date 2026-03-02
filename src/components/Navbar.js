"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Dashboard" },
    { href: "/new-entry", label: "New Entry" },
    { href: "/records", label: "Records" },
  ];

  return (
    <nav className="bg-slate-800 text-white shadow-lg print:hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center xs:block xs:h-24 xs:pt-5 justify-between h-16">
          <Link href="/" className="text-xl font-bold tracking-wide">
            🅿️ ParkEasy
          </Link>
          <div className="flex space-x-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 xs:px-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "hover:underline transition-all text-blue-500"
                    : "text-slate-300 hover:bg-slate-700 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
