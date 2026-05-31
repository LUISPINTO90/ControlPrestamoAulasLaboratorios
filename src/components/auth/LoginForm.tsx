"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  email: z.string().email("Correo electrónico inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

const inputClass =
  "h-11 rounded-xl border-[#D4E0DB] bg-[#F4F8F6] focus:bg-white text-[15px] text-[#1A2E25] placeholder:text-[#7A9088] focus:border-[#2C4A3E] focus:ring-[#2C4A3E] transition-colors font-sans";

export function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setError("");
    const result = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });
    setLoading(false);
    if (result?.error) {
      setError("Correo o contraseña incorrectos.");
    } else {
      onSuccess();
      router.push("/home");
      router.refresh();
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-sans text-[13px] font-semibold text-[#2C4A3E]">
                Correo electrónico
              </FormLabel>
              <FormControl>
                <Input placeholder="nombre@correo.com" className={inputClass} {...field} />
              </FormControl>
              <FormMessage className="text-red-500 text-[12px]" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-sans text-[13px] font-semibold text-[#2C4A3E]">
                Contraseña
              </FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" className={inputClass} {...field} />
              </FormControl>
              <FormMessage className="text-red-500 text-[12px]" />
            </FormItem>
          )}
        />
        {error && (
          <p className="font-sans text-[13px] text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="font-sans w-full h-11 rounded-full bg-[#F5E44A] hover:bg-[#EFD93A] disabled:opacity-50 text-[#1A2E25] text-[15px] font-semibold transition-colors mt-1"
        >
          {loading ? "Entrando…" : "Continuar"}
        </button>
      </form>
    </Form>
  );
}
