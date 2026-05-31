"use client";

import { signOut } from "next-auth/react";

export function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="font-sans text-[13px] font-medium text-white/50 hover:text-white transition-colors"
    >
      Salir
    </button>
  );
}
