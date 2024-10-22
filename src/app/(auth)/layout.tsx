// src/app/(auth)/layout.tsx

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/auth/LogoutButton";

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
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-end items-center border-b">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700">
              {session.user.name} ({session.user.userType})
            </span>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="flex-grow w-full">{children}</main>

      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Tu Aplicación. Todos los derechos
          reservados.
        </div>
      </footer>
    </div>
  );
}
