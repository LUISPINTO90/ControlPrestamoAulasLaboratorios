import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";

export default async function Home() {
  const session = await getServerSession(authOptions);
  const firstName = session?.user?.name?.split(" ")[0] ?? "Usuario";

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <p className="font-sans text-[13px] font-semibold text-[#7A9088] mb-2">
          Hola, {firstName}
        </p>
        <h1 className="font-sans font-bold text-[30px] sm:text-[40px] lg:text-[52px] tracking-tight leading-tight text-[#1A2E25]">
          ¿Qué espacio necesitas hoy?
        </h1>
      </div>

      <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
        <Link
          href="/spaces"
          className="group bg-white rounded-2xl border border-[#D4E0DB] p-5 sm:p-7 hover:border-[#2C4A3E] hover:shadow-sm transition-all"
        >
          <p className="font-sans text-[12px] font-semibold text-[#2C4A3E] mb-2 sm:mb-3">Reservar</p>
          <h2 className="font-sans font-bold text-[20px] sm:text-[26px] text-[#1A2E25] mb-1 sm:mb-2 tracking-tight leading-tight group-hover:text-[#2C4A3E] transition-colors">
            Explorar espacios
          </h2>
          <p className="font-sans text-[13px] sm:text-[14px] text-[#7A9088] leading-relaxed">
            Consulta la disponibilidad de salones y laboratorios.
          </p>
        </Link>

        <Link
          href="/my-reservations"
          className="group bg-[#2C4A3E] rounded-2xl p-5 sm:p-7 hover:bg-[#1A2E25] transition-all"
        >
          <p className="font-sans text-[12px] font-semibold text-[#F5E44A] mb-2 sm:mb-3">Gestionar</p>
          <h2 className="font-sans font-bold text-[20px] sm:text-[26px] text-white mb-1 sm:mb-2 tracking-tight leading-tight">
            Mis reservaciones
          </h2>
          <p className="font-sans text-[13px] sm:text-[14px] text-white/50 leading-relaxed">
            Revisa y cancela tus reservaciones activas.
          </p>
        </Link>
      </div>
    </div>
  );
}
