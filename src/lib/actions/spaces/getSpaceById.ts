//src\lib\actions\spaces\getSpaceById.ts
"use server";

import { db } from "@/lib/db";

export async function getSpaceById(id: string) {
  try {
    const space = await db.space.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    return space;
  } catch (error) {
    console.error("Error fetching space:", error);
    return null;
  }
}
