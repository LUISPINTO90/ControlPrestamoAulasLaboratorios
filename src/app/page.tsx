"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { useState } from "react";

const SLOTS = [
  { time: "07:00 – 08:00", status: "past" },
  { time: "08:00 – 09:00", status: "past" },
  { time: "09:00 – 10:00", status: "occupied", who: "M. González" },
  { time: "10:00 – 11:00", status: "available" },
  { time: "11:00 – 12:00", status: "available" },
  { time: "12:00 – 13:00", status: "occupied", who: "R. Torres" },
  { time: "13:00 – 14:00", status: "available" },
];

export default function Welcome() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF7]">
      {/* Navbar */}
      <nav className="flex-none h-14 flex items-center justify-between px-4 sm:px-8 border-b border-[#D4E0DB] bg-[#FAFAF7]">
        <span className="font-sans font-semibold text-[15px] sm:text-[16px] text-[#1A2E25] tracking-tight">
          PrestaSalones
        </span>
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setShowLogin(true)}
            className="font-sans text-[13px] sm:text-[14px] text-[#7A9088] hover:text-[#1A2E25] transition-colors"
          >
            Iniciar sesión
          </button>
          <button
            onClick={() => setShowRegister(true)}
            className="font-sans text-[13px] sm:text-[14px] font-semibold bg-[#2C4A3E] hover:bg-[#1A2E25] text-white px-3 sm:px-4 py-2 rounded-full transition-colors"
          >
            Crear cuenta
          </button>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 grid lg:grid-cols-2 lg:gap-0 max-w-screen-xl mx-auto w-full">
        {/* Left — copy */}
        <div className="flex flex-col justify-center px-6 sm:px-10 lg:pl-16 lg:pr-4 py-14 lg:py-0">
          <span className="inline-flex items-center font-sans text-[12px] font-medium text-[#2C4A3E] bg-[#E4EDE9] border border-[#C4D8D0] px-3 py-1 rounded-full mb-6 w-fit">
            Facultad de Telemática
          </span>

          <h1 className="font-sans text-[44px] sm:text-[58px] lg:text-[68px] font-semibold text-[#1A2E25] leading-[1.0] tracking-tight mb-5">
            Reserva<br />
            tu <span className="italic font-bold uppercase">ESPACIO</span><br />
            <span className="text-[#2C4A3E]">al instante.</span>
          </h1>

          <p className="font-sans text-[15px] sm:text-[16px] text-[#7A9088] leading-relaxed max-w-sm mb-8">
            Consulta disponibilidad y reserva salones o laboratorios en segundos, sin filas ni papeleo.
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowRegister(true)}
              className="font-sans font-semibold text-[14px] sm:text-[15px] bg-[#F5E44A] hover:bg-[#EFD93A] text-[#1A2E25] px-6 sm:px-7 py-3 rounded-full transition-colors"
            >
              Comenzar gratis
            </button>
            <button
              onClick={() => setShowLogin(true)}
              className="font-sans font-medium text-[14px] sm:text-[15px] border border-[#2C4A3E]/25 text-[#2C4A3E] hover:bg-[#E4EDE9] px-6 sm:px-7 py-3 rounded-full transition-colors"
            >
              Ya tengo cuenta
            </button>
          </div>
        </div>

        {/* Right — schedule visual (solo desktop) */}
        <div className="hidden lg:flex flex-col justify-center pl-4 pr-16 py-10">
          <div className="bg-white rounded-3xl border border-[#D4E0DB] overflow-hidden shadow-sm">
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#E4EDE9]">
              <div>
                <p className="font-sans text-[11px] font-semibold tracking-normal text-[#7A9088]">
                  Hoy
                </p>
                <p className="font-sans text-[16px] font-bold text-[#1A2E25]">
                  Laboratorio de Redes
                </p>
              </div>
              <span className="font-sans text-[11px] font-semibold bg-[#E4EDE9] text-[#2C4A3E] px-3 py-1 rounded-full">
                Laboratorio
              </span>
            </div>

            <div className="divide-y divide-[#F0F5F3]">
              {SLOTS.map((slot) => (
                <div
                  key={slot.time}
                  className={`flex items-center justify-between px-6 py-3 ${
                    slot.status === "available" ? "bg-[#F5E44A]/10" : ""
                  }`}
                >
                  <span className={`font-sans text-[14px] tabular-nums ${
                    slot.status === "past" ? "text-[#B0BDB9]" : "text-[#1A2E25] font-medium"
                  }`}>
                    {slot.time}
                  </span>
                  {slot.status === "available" && (
                    <span className="font-sans text-[12px] font-semibold bg-[#F5E44A] text-[#1A2E25] px-3 py-1 rounded-full">
                      Disponible
                    </span>
                  )}
                  {slot.status === "occupied" && (
                    <span className="font-sans text-[13px] text-[#7A9088]">{slot.who}</span>
                  )}
                  {slot.status === "past" && (
                    <span className="font-sans text-[12px] text-[#C5D0CC]">—</span>
                  )}
                </div>
              ))}
            </div>

            <div className="px-6 py-4 border-t border-[#E4EDE9] bg-[#FAFAF7]">
              <p className="font-sans text-[13px] text-[#7A9088]">
                2 horarios libres · próximo a las{" "}
                <span className="font-semibold text-[#2C4A3E]">10:00</span>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Dialogs */}
      <Dialog open={showLogin} onOpenChange={setShowLogin}>
        <DialogContent className="bg-white w-[calc(100vw-2rem)] sm:max-w-sm rounded-2xl border border-[#D4E0DB] shadow-2xl p-6 sm:p-8">
          <DialogHeader className="mb-5">
            <p className="font-sans text-[11px] font-semibold tracking-normal text-[#2C4A3E] mb-1">
              PrestaSalones
            </p>
            <DialogTitle className="font-sans font-bold text-[20px] sm:text-[22px] text-[#1A2E25]">
              Iniciar sesión
            </DialogTitle>
          </DialogHeader>
          <LoginForm onSuccess={() => setShowLogin(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={showRegister} onOpenChange={setShowRegister}>
        <DialogContent className="bg-white w-[calc(100vw-2rem)] sm:max-w-sm rounded-2xl border border-[#D4E0DB] shadow-2xl p-6 sm:p-8">
          <DialogHeader className="mb-5">
            <p className="font-sans text-[11px] font-semibold tracking-normal text-[#2C4A3E] mb-1">
              PrestaSalones
            </p>
            <DialogTitle className="font-sans font-bold text-[20px] sm:text-[22px] text-[#1A2E25]">
              Crear cuenta
            </DialogTitle>
          </DialogHeader>
          <RegisterForm onSuccess={() => setShowRegister(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
