"use server";

import { db } from "@/lib/db";

export async function getSpaces() {
  try {
    const spaces = await db.space.findMany({
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
        spaceType: true,
        capacity: true,
        location: true,
      },
    });
    return { spaces };
  } catch (error) {
    console.error("Error fetching spaces:", error);
    return { error: "Failed to fetch spaces" };
  }
}
