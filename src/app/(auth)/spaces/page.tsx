import { getSpaces } from "@/lib/actions/spaces/getSpaces";
import { SpacesList } from "@/components/spaces/SpacesList";

export default async function SpacesPage() {
  const { spaces } = await getSpaces();

  return (
    <div className="space-y-6">
      <div>
        <p className="font-sans text-[12px] font-semibold tracking-normal text-[#7A9088] mb-2">
          Facultad de Telemática
        </p>
        <h1 className="font-sans font-bold text-[40px] text-[#1A2E25] tracking-tight leading-tight">
          Espacios disponibles
        </h1>
      </div>
      <SpacesList spaces={spaces || []} />
    </div>
  );
}

