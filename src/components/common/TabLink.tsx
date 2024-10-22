"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export function TabLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "px-3 py-2 rounded-md text-sm font-medium",
        isActive
          ? "text-blue-600 bg-blue-100 rounded"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
      )}
    >
      {label}
    </Link>
  );
}
