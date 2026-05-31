import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { TabLink } from "@/components/common/TabLink";
import Link from "next/link";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  const userTypeLabel: Record<string, string> = {
    Student: "Estudiante",
    Teacher: "Profesor",
    Administrator: "Administrador",
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAF7]">
      <header className="bg-[#2C4A3E] sticky top-0 z-40">
        {/* Top row: logo + user */}
        <div className="max-w-screen-lg mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/home">
            <span className="font-sans font-bold text-[17px] sm:text-[19px] text-white tracking-tight">
              PrestaSalones
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end">
              <p className="font-sans text-[13px] font-medium text-white leading-tight">
                {session.user.name}
              </p>
              <span className="font-sans text-[11px] font-medium bg-white/10 text-white/70 px-2 py-0.5 rounded-full mt-0.5">
                {userTypeLabel[session.user.userType ?? ""] ?? session.user.userType}
              </span>
            </div>
            <div className="w-px h-5 bg-white/15 hidden sm:block" />
            <LogoutButton />
          </div>
        </div>

        {/* Nav row — always visible, no overflow */}
        <div className="max-w-screen-lg mx-auto px-2 sm:px-6 border-t border-white/10 flex">
          <TabLink href="/spaces" label="Espacios" />
          <TabLink href="/my-reservations" label="Reservaciones" />
        </div>
      </header>

      <main className="flex-grow max-w-screen-lg w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {children}
      </main>

      <footer className="border-t border-[#D4E0DB]">
        <div className="max-w-screen-lg mx-auto px-4 sm:px-6 py-4 font-sans text-[12px] text-[#7A9088]">
          © {new Date().getFullYear()} PrestaSalones · Facultad de Telemática
        </div>
      </footer>
    </div>
  );
}
