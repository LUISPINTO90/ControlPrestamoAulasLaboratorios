// src/app/(auth)/spaces/page.tsx
import { getSpaces } from "@/lib/actions/spaces/getSpaces";
import { SpacesList } from "@/components/spaces/SpacesList";
import { Card } from "@/components/ui/card";

export default async function SpacesPage() {
  const { spaces } = await getSpaces();

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <p className="max-w-2xl text-blue-500 text-sm uppercase">
          Espacios a reservar
        </p>
        <h1 className="max-w-2xl mb-4 text-4xl font-bold tracking-tight leading-none">
          Salones y Laboratorios
        </h1>
        <SpacesList spaces={spaces || []} />
      </Card>
    </div>
  );
}
