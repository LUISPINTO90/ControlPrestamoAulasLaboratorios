import { Card } from "@/components/ui/card";

export default async function Home() {
  return (
    <div className="space-y-6">
      <Card className="p-4">
        <h1 className="max-w-2xl mb-4 text-4xl font-bold tracking-tight leading-none">
          Empieza a reservar espacios dentro de la{" "}
          <span className="text-blue-600">Facultad de Telemática</span> ahora
          mismo!
        </h1>

        <p className="text-gray-500 max-w-lg">
          Bienvenido a PrestaSalones™, la plataforma de reservaciones de
          espacios de la Facultad de Telemática. Aquí podrás reservar salones y
          laboratorios para tus eventos, clases, reuniones y más.
        </p>
      </Card>
    </div>
  );
}
