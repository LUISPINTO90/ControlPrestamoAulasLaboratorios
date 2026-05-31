"use client";

import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { register } from "@/lib/actions/auth.actions";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const formSchema = z
  .object({
    email: z.string().email("Correo inválido"),
    password: z.string().min(6, "Mínimo 6 caracteres"),
    confirmPassword: z.string().min(6, "Confirma tu contraseña"),
    firstName: z.string().min(2, "Mínimo 2 caracteres"),
    lastName: z.string().min(2, "Mínimo 2 caracteres"),
    userType: z.enum(["Student", "Teacher", "Administrator"]),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

const inputClass =
  "h-11 rounded-xl border-[#D4E0DB] bg-[#F4F8F6] focus:bg-white text-[15px] text-[#1A2E25] placeholder:text-[#7A9088] focus:border-[#2C4A3E] focus:ring-[#2C4A3E] transition-colors font-sans";
const labelClass = "font-sans text-[13px] font-semibold text-[#2C4A3E]";

export function RegisterForm({ onSuccess }: { onSuccess: () => void }) {
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      userType: "Student",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setError("");
    const result = await register(values);
    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }
    const login = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });
    setLoading(false);
    if (login?.error) {
      setError("Cuenta creada. Inicia sesión manualmente.");
      return;
    }
    onSuccess();
    router.push("/home");
    router.refresh();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={labelClass}>Nombre</FormLabel>
                <FormControl>
                  <Input placeholder="Juan" className={inputClass} {...field} />
                </FormControl>
                <FormMessage className="text-red-500 text-[11px]" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={labelClass}>Apellido</FormLabel>
                <FormControl>
                  <Input placeholder="García" className={inputClass} {...field} />
                </FormControl>
                <FormMessage className="text-red-500 text-[11px]" />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={labelClass}>Correo electrónico</FormLabel>
              <FormControl>
                <Input placeholder="nombre@correo.com" className={inputClass} {...field} />
              </FormControl>
              <FormMessage className="text-red-500 text-[11px]" />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={labelClass}>Contraseña</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••" className={inputClass} {...field} />
                </FormControl>
                <FormMessage className="text-red-500 text-[11px]" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={labelClass}>Confirmar</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••" className={inputClass} {...field} />
                </FormControl>
                <FormMessage className="text-red-500 text-[11px]" />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="userType"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={labelClass}>Tipo de usuario</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className={`${inputClass} w-full`}>
                    <SelectValue placeholder="Selecciona un tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-white rounded-xl border-[#D4E0DB] shadow-lg">
                  <SelectItem value="Student" className="font-sans text-[14px] py-2.5 cursor-pointer">Estudiante</SelectItem>
                  <SelectItem value="Teacher" className="font-sans text-[14px] py-2.5 cursor-pointer">Profesor</SelectItem>
                  <SelectItem value="Administrator" className="font-sans text-[14px] py-2.5 cursor-pointer">Administrador</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage className="text-red-500 text-[11px]" />
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
          {loading ? "Creando cuenta…" : "Crear cuenta"}
        </button>
      </form>
    </Form>
  );
}
