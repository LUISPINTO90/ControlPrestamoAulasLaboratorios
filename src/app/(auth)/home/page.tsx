// src/app/(auth)/home/page.tsx

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

import { LogoutButton } from "@/components/auth/LogoutButton";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  return (
    <div className="max-w-screen-xl mx-auto p-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Bienvenido(a)</h1>
        <div className="space-y-2">
          <p className="text-lg">
            <span className="font-semibold">Nombre:</span> {session.user.name}
          </p>
          <p className="text-lg">
            <span className="font-semibold">Correo:</span> {session.user.email}
          </p>
          <p className="text-lg">
            <span className="font-semibold">Tipo de usuario:</span>{" "}
            {session.user.userType}
          </p>

          {session && <LogoutButton />}
        </div>
      </div>
    </div>
  );
}
