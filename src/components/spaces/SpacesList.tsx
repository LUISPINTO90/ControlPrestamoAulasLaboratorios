// src/components/spaces/spaces-list.tsx
import Link from "next/link";
import { Card } from "@/components/ui/card";

interface Space {
  id: number;
  name: string;
  spaceType: "Laboratory" | "Classroom";
  capacity: number;
  location: string;
}

interface SpacesListProps {
  spaces: Space[];
}

export function SpacesList({ spaces }: SpacesListProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {spaces.map((space) => (
        <Link href={`/spaces/${space.id}`} key={space.id}>
          <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold">{space.name}</h3>
            </div>
            <p className="text-xs uppercase font-semibold mb-2">
              {space.spaceType}
            </p>
            <p className="text-sm text-gray-500 mb-2">{space.location}</p>
          </Card>
        </Link>
      ))}
    </div>
  );
}
