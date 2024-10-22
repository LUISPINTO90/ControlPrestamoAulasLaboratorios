"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

export function LogoutButton() {
  return (
    <Button variant="outlineBlue" onClick={() => signOut({ callbackUrl: "/" })}>
      Cerrar sesión
    </Button>
  );
}