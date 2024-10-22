// src/app/page.tsx
"use client";

import Navbar from "@/components/common/Navbar";
import Hero from "@/components/common/Hero";
import Footer from "@/components/common/Footer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { useState } from "react";

export default function Welcome() {
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showRegisterDialog, setShowRegisterDialog] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero
          onLoginClick={() => setShowLoginDialog(true)}
          onRegisterClick={() => setShowRegisterDialog(true)}
        />
      </main>
      <Footer />

      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Iniciar sesión</DialogTitle>
          </DialogHeader>
          <LoginForm onSuccess={() => setShowLoginDialog(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={showRegisterDialog} onOpenChange={setShowRegisterDialog}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Registro</DialogTitle>
          </DialogHeader>
          <RegisterForm onSuccess={() => setShowRegisterDialog(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
