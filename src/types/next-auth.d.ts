// src/types/next-auth.d.ts
import "next-auth";
import { UserType } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      userType: UserType;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    userType: UserType;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    userType: UserType;
  }
}
