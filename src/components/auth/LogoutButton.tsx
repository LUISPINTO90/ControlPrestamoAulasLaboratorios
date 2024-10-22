// src/components/LogoutButton.tsx
"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

export function LogoutButton() {
  return (
    <Button variant="destructive" onClick={() => signOut({ callbackUrl: "/" })}>
      Cerrar sesión
    </Button>
  );
}
