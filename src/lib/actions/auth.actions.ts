// src/lib/actions/auth.actions.ts
"use server";

import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { UserType } from "@prisma/client";

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  userType: UserType;
}

export async function register(data: RegisterData) {
  try {
    const existingUser = await db.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return { error: "El correo electrónico ya está registrado" };
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    await db.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        userType: data.userType,
      },
    });

    return { success: "Usuario registrado exitosamente" };
  } catch {
    return { error: "Error al registrar el usuario" };
  }
}
