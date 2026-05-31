import { Button } from "../ui/button";

interface HeroProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

export default function Hero({ onLoginClick, onRegisterClick }: HeroProps) {
  return (
    <section className="min-h-[calc(100vh-57px)] flex items-center bg-white">
      <div className="max-w-screen-lg mx-auto px-6 py-24 w-full">
        <p className="text-[15px] text-[#0071e3] font-medium mb-4 tracking-normal">
          Facultad de Telemática
        </p>
        <h1 className="text-[56px] font-bold tracking-tight text-[#1d1d1f] leading-[1.07] mb-6 max-w-3xl">
          Reserva salones y laboratorios sin complicaciones.
        </h1>
        <p className="text-[19px] text-[#6e6e73] mb-10 max-w-xl leading-relaxed">
          Gestiona el uso de los espacios académicos de forma rápida, desde cualquier dispositivo.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={onRegisterClick}
            className="h-11 px-6 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white text-[15px] font-medium transition-colors shadow-none border-0"
          >
            Comenzar gratis
          </Button>
          <Button
            variant="outline"
            onClick={onLoginClick}
            className="h-11 px-6 rounded-full border-[#d2d2d7] bg-white text-[#1d1d1f] text-[15px] font-medium hover:bg-[#f5f5f7] transition-colors shadow-none"
          >
            Iniciar sesión
          </Button>
        </div>
      </div>
    </section>
  );
}
