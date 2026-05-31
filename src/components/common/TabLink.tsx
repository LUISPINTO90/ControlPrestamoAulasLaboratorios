"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export function TabLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(href + "/");

  return (
    <Link
      href={href}
      className={cn(
        "font-sans text-[14px] font-medium px-3 py-1.5 rounded-lg transition-colors",
        isActive
          ? "bg-[#F5E44A] text-[#1A2E25]"
          : "text-white/70 hover:text-white hover:bg-white/10"
      )}
    >
      {label}
    </Link>
  );
}
