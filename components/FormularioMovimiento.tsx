"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { crearMovimiento } from "@/actions/finanzas";
import { PlusCircle, AlertCircle, CheckCircle2 } from "lucide-react";

// 1. Esquema de validación con Zod
const movimientoSchema = z.object({
  descripcion: z
    .string()
    .min(3, "La descripción debe tener al menos 3 caracteres")
    .max(60, "Máximo 60 caracteres"),
  monto: z.coerce
    .number()
    .positive("El monto debe ser mayor a $0"),
  tipo: z.enum(["ingreso", "gasto"], {
    message: "Seleccioná un tipo válido",
  }),
  categoria: z
    .string()
    .min(2, "La categoría debe tener al menos 2 caracteres")
    .max(30, "Máximo 30 caracteres"),
  cuenta_id: z
    .string()
    .min(1, "Tenés que seleccionar una cuenta"),
});

type MovimientoFormValues = z.infer<typeof movimientoSchema>;

interface Cuenta {
  id: number;
  nombre: string;
  tipo: string;
}

interface FormularioMovimientoProps {
  cuentas: Cuenta[];
}

export function FormularioMovimiento({ cuentas }: FormularioMovimientoProps) {
  const [enviando, setEnviando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(movimientoSchema),
    defaultValues: {
      descripcion: "",
      monto: "",
      tipo: "gasto",
      categoria: "",
      cuenta_id: "",
    },
  });

  const onSubmit = async (data: MovimientoFormValues) => {
    setEnviando(true);
    setMensajeExito(false);

    try {
      const formData = new FormData();
      formData.append("descripcion", data.descripcion);
      formData.append("monto", String(data.monto));
      formData.append("tipo", data.tipo);
      formData.append("categoria", data.categoria);
      formData.append("cuenta_id", data.cuenta_id);

      await crearMovimiento(formData);

      reset();
      setMensajeExito(true);
      router.refresh();
      setTimeout(() => setMensajeExito(false), 3000);
    } catch (error) {
      console.error("Error al guardar:", error);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="bg-[#0E7490]/30 border border-[#BAE6FD]/20 p-6 rounded-3xl shadow-xl h-fit hover:border-[#BAE6FD]/40 transition-all duration-300 backdrop-blur-md">
      <h2 className="text-xl font-bold text-[#F0FDFF] mb-5 flex items-center gap-2.5">
        <PlusCircle className="w-6 h-6 text-[#22C55E]" />
        Nuevo Movimiento
      </h2>

      {mensajeExito && (
        <div className="mb-4 p-3 rounded-2xl bg-[#22C55E]/20 border border-[#22C55E]/40 text-[#22C55E] text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          ¡Movimiento registrado correctamente!
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
        {/* Descripción */}
        <div>
          <label className="text-xs text-[#BAE6FD] font-semibold mb-1.5 block">Descripción</label>
          <input
            type="text"
            {...register("descripcion")}
            placeholder="Ej. Supermercado, Sueldo..."
            className={`w-full bg-[#082F49]/90 text-[#F0FDFF] border rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 text-sm transition-all shadow-inner placeholder:text-[#BAE6FD]/40 ${
              errors.descripcion
                ? "border-rose-400 focus:ring-rose-400"
                : "border-[#BAE6FD]/30 focus:ring-[#22C55E]"
            }`}
          />
          {errors.descripcion && (
            <p className="text-rose-300 text-xs mt-1.5 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {errors.descripcion.message as string}
            </p>
          )}
        </div>

        {/* Monto */}
        <div>
          <label className="text-xs text-[#BAE6FD] font-semibold mb-1.5 block">Monto ($)</label>
          <input
            type="number"
            step="0.01"
            {...register("monto")}
            placeholder="0.00"
            className={`w-full bg-[#082F49]/90 text-[#F0FDFF] border rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 text-sm transition-all shadow-inner placeholder:text-[#BAE6FD]/40 ${
              errors.monto
                ? "border-rose-400 focus:ring-rose-400"
                : "border-[#BAE6FD]/30 focus:ring-[#22C55E]"
            }`}
          />
          {errors.monto && (
            <p className="text-rose-300 text-xs mt-1.5 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {errors.monto.message as string}
            </p>
          )}
        </div>

        {/* Tipo y Categoría */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-[#BAE6FD] font-semibold mb-1.5 block">Tipo</label>
            <select
              {...register("tipo")}
              className="w-full bg-[#082F49]/90 text-[#F0FDFF] border border-[#BAE6FD]/30 rounded-2xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[#22C55E] text-sm transition-all cursor-pointer"
            >
              <option value="ingreso" className="bg-[#082F49] text-[#F0FDFF]">Ingreso</option>
              <option value="gasto" className="bg-[#082F49] text-[#F0FDFF]">Gasto</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-[#BAE6FD] font-semibold mb-1.5 block">Categoría</label>
            <input
              type="text"
              {...register("categoria")}
              placeholder="Ej. Comida"
              className={`w-full bg-[#082F49]/90 text-[#F0FDFF] border rounded-2xl px-3 py-3 focus:outline-none focus:ring-2 text-sm transition-all shadow-inner placeholder:text-[#BAE6FD]/40 ${
                errors.categoria
                  ? "border-rose-400 focus:ring-rose-400"
                  : "border-[#BAE6FD]/30 focus:ring-[#22C55E]"
              }`}
            />
            {errors.categoria && (
              <p className="text-rose-300 text-xs mt-1.5 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errors.categoria.message as string}
              </p>
            )}
          </div>
        </div>

        {/* Cuenta */}
        <div>
          <label className="text-xs text-[#BAE6FD] font-semibold mb-1.5 block">Cuenta</label>
          <select
            {...register("cuenta_id")}
            className={`w-full bg-[#082F49]/90 text-[#F0FDFF] border rounded-2xl px-3 py-3 focus:outline-none focus:ring-2 text-sm transition-all cursor-pointer ${
              errors.cuenta_id
                ? "border-rose-400 focus:ring-rose-400"
                : "border-[#BAE6FD]/30 focus:ring-[#22C55E]"
            }`}
          >
            <option value="" className="bg-[#082F49] text-[#BAE6FD]">
              Seleccionar cuenta ({cuentas.length} disp.)
            </option>
            {cuentas.map((cuenta) => (
              <option key={cuenta.id} value={cuenta.id} className="bg-[#082F49] text-[#F0FDFF] py-2">
                {cuenta.nombre} ({cuenta.tipo})
              </option>
            ))}
          </select>
          {errors.cuenta_id && (
            <p className="text-rose-300 text-xs mt-1.5 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {errors.cuenta_id.message as string}
            </p>
          )}
        </div>

        {/* Botón de envío */}
        <button
          type="submit"
          disabled={enviando}
          className="mt-2 w-full bg-[#22C55E] hover:bg-[#1eb355] disabled:opacity-50 disabled:cursor-not-allowed text-[#082F49] font-extrabold py-3.5 px-6 rounded-2xl shadow-lg shadow-[#22C55E]/20 transition duration-300 text-sm flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
        >
          {enviando ? "Guardando..." : "Registrar Movimiento"}
        </button>
      </form>
    </div>
  );
}