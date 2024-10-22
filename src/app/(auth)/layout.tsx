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

  if (!session) {
    redirect("/");
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white shadow-sm border-b">
        <div className="mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <Link href="/home">
            <div className="flex flex-col items-start hover:bg-gray-200 p-2 rounded">
              <p className="text-base text-gray-700 font-bold">
                {session.user.name}
              </p>
              <p className="text-xs text-gray-600 uppercase mt-1">
                {session.user.userType}
              </p>
            </div>
          </Link>
          <LogoutButton />
        </div>
        <nav className="bg-gray-50 border-t border-gray-200">
          <div className="mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-4">
              <TabLink href="/spaces" label="Espacios" />
              <TabLink href="/my-reservations" label="Mis reservaciones" />
            </div>
          </div>
        </nav>
      </header>

      <main className="flex-grow max-w-screen-xl m-8 text-gray-900">
        {children}
      </main>

      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} PrestaSalones™. Todos los derechos
          reservados.
        </div>
      </footer>
    </div>
  );
}
