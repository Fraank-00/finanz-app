"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

// Función auxiliar para obtener el session_id actual del visitante
async function getSessionId() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("finanz_session_id")?.value;
  if (!sessionId) {
    throw new Error("Sesión no encontrada. Recargá la página.");
  }
  return sessionId;
}

export async function crearCuenta(formData: FormData) {
  const session_id = await getSessionId();
  const nombre = formData.get("nombre");
  const tipo = formData.get("tipo");
  const color = formData.get("color");

  if (
    typeof nombre !== "string" ||
    !nombre.trim() ||
    typeof tipo !== "string" ||
    !tipo.trim()
  ) {
    throw new Error("Por favor completa el nombre y el tipo de la cuenta");
  }

  const { error } = await supabase.from("cuentas").insert([
    {
      nombre: nombre.trim(),
      tipo: tipo.trim(),
      color: typeof color === "string" && color ? color : "emerald",
      session_id,
    },
  ]);

  if (error) {
    console.error("Error al insertar cuenta:", error);
    throw new Error("No se pudo guardar la cuenta");
  }

  revalidatePath("/");
}

export async function crearMovimiento(formData: FormData) {
  const session_id = await getSessionId();
  const descripcion = formData.get("descripcion") as string;
  const monto = Number(formData.get("monto"));
  const tipo = formData.get("tipo") as "ingreso" | "gasto";
  const categoria = formData.get("categoria") as string;
  const cuenta_id = Number(formData.get("cuenta_id"));

  if (!descripcion || !monto || !tipo || !categoria || !cuenta_id) {
    throw new Error("Por favor completa todos los campos");
  }

  const { error } = await supabase.from("movimientos").insert([
    {
      descripcion,
      monto,
      tipo,
      categoria,
      cuenta_id,
      session_id,
    },
  ]);

  if (error) {
    console.error("Error al insertar movimiento:", error);
    throw new Error("No se pudo guardar el movimiento");
  }

  revalidatePath("/");
}

// Eliminar un movimiento por su ID y su sesión
export async function eliminarMovimiento(id: number) {
  const session_id = await getSessionId();
  const { error } = await supabase
    .from("movimientos")
    .delete()
    .eq("id", id)
    .eq("session_id", session_id);

  if (error) {
    console.error("Error al eliminar movimiento:", error);
    throw new Error("No se pudo eliminar el movimiento");
  }

  revalidatePath("/");
}

// Editar un movimiento existente validando la sesión
export async function editarMovimiento(id: number, formData: FormData) {
  const session_id = await getSessionId();
  const descripcion = formData.get("descripcion");
  const monto = Number(formData.get("monto"));
  const tipo = formData.get("tipo");
  const categoria = formData.get("categoria");
  const cuenta_id = formData.get("cuenta_id") ? Number(formData.get("cuenta_id")) : null;

  const { error } = await supabase
    .from("movimientos")
    .update({ descripcion, monto, tipo, categoria, cuenta_id })
    .eq("id", id)
    .eq("session_id", session_id);

  if (error) {
    console.error("Error al editar movimiento:", error);
    throw new Error("No se pudo actualizar el movimiento");
  }

  revalidatePath("/");
}