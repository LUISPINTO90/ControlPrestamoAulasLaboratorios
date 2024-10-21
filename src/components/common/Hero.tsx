import { FaArrowRight, FaSignInAlt } from "react-icons/fa";

import { Button } from "../ui/button";

export default function Hero() {
  return (
    <section className="py-12 px-4 text-gray-900">
      <div className="max-w-screen-xl mx-auto text-center">
        <h1 className="text-4xl font-bold tracking-tight lg:text-6xl mb-6">
          Reserva un salón o laboratorio de forma{" "}
          <span className="text-blue-600">sencilla</span>
        </h1>
        <p className="text-xl text-gray-500 mb-8 max-w-2xl mx-auto">
          Gestiona la reserva de aulas y laboratorios de manera eficiente, en la
          facultad de Telemática.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button size="lg" className="rounded text-white text-base">
            Registrarme
            <FaArrowRight className="mr-2 h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-gray-300 rounded text-base"
          >
            <FaSignInAlt className="mr-2 h-5 w-5" />
            Iniciar sesión
          </Button>
        </div>
      </div>
    </section>
  );
}
