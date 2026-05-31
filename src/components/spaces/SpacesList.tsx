import Link from "next/link";

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

const typeLabel = { Laboratory: "Laboratorio", Classroom: "Salón" };

export function SpacesList({ spaces }: SpacesListProps) {
  if (spaces.length === 0) {
    return (
      <p className="font-sans text-[15px] text-[#7A9088] py-12 text-center">
        No hay espacios disponibles.
      </p>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {spaces.map((space, i) => (
        <Link href={`/spaces/${space.id}`} key={space.id} className="group">
          <div className="bg-white rounded-2xl border border-[#D4E0DB] p-6 hover:border-[#2C4A3E] hover:shadow-sm transition-all h-full flex flex-col">
            <p className="font-sans text-[11px] font-semibold tracking-normal text-[#7A9088] mb-3">
              {typeLabel[space.spaceType]}
            </p>
            <h3 className="font-sans font-bold text-[20px] text-[#1A2E25] mb-4 leading-snug group-hover:text-[#2C4A3E] transition-colors flex-1">
              {space.name}
            </h3>
            <div className="border-t border-[#E4EDE9] pt-3 flex justify-between items-end gap-3">
              <p className="font-sans text-[13px] text-[#7A9088] min-w-0 truncate">{space.location}</p>
              <span className="font-sans text-[12px] font-semibold bg-[#F5E44A] text-[#1A2E25] px-2.5 py-1 rounded-full shrink-0 whitespace-nowrap">
                {space.capacity} pers.
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

