"use client";

import { useState, useMemo, useEffect } from "react";
import { ArrowUpRight, ArrowDownLeft, Search, Trash2, Pencil, X, Check, AlertCircle } from "lucide-react";
import { eliminarMovimiento, editarMovimiento } from "@/actions/finanzas";
import { useRouter } from "next/navigation";

interface Movimiento {
  id: number;
  descripcion: string;
  monto: number;
  tipo: "ingreso" | "gasto";
  categoria: string;
  fecha: string;
  cuenta_id: number | null;
  editado?: boolean; // Campo opcional para reflejar si fue editado
}

interface Cuenta {
  id: number;
  nombre: string;
  tipo: string;
}

interface ClientSideMovimientosProps {
  movimientos: Movimiento[];
  cuentas: Cuenta[];
}

export function ClientSideMovimientos({ movimientos, cuentas }: ClientSideMovimientosProps) {
  const [montado, setMontado] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [filtroTipo, setFiltroTipo] = useState<string>("todos");
  const [filtroCategoria, setFiltroCategoria] = useState<string>("todas");
  
  // Estados para la edición y notificaciones visuales
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [editDesc, setEditDesc] = useState("");
  const [editMonto, setEditMonto] = useState("");
  const [editTipo, setEditTipo] = useState<"ingreso" | "gasto">("gasto");
  const [editCat, setEditCat] = useState("");
  const [editCuentaId, setEditCuentaId] = useState<string>("");
  const [cargandoAccion, setCargandoAccion] = useState(false);

  // Estados para alertas visuales personalizadas
  const [mensajeAlerta, setMensajeAlerta] = useState<string | null>(null);
  const [idEliminando, setIdEliminando] = useState<number | null>(null);

  const router = useRouter();

  useEffect(() => {
    setMontado(true);
  }, []);

  const categoriasUnicas = useMemo(() => {
    const cats = movimientos.map((m) => m.categoria);
    return Array.from(new Set(cats));
  }, [movimientos]);

  const movimientosFiltrados = useMemo(() => {
    return movimientos.filter((m) => {
      const coincideTexto = m.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
                            m.categoria.toLowerCase().includes(busqueda.toLowerCase());
      
      const coincideTipo = filtroTipo === "todos" || m.tipo === filtroTipo;
      const coincideCategoria = filtroCategoria === "todas" || m.categoria === filtroCategoria;

      return coincideTexto && coincideTipo && coincideCategoria;
    });
  }, [movimientos, busqueda, filtroTipo, filtroCategoria]);

  const confirmarEliminar = (id: number) => {
    setIdEliminando(id);
  };

  const ejecutarEliminacion = async (id: number) => {
    try {
      setCargandoAccion(true);
      await eliminarMovimiento(id);
      setIdEliminando(null);
      setMensajeAlerta("Movimiento eliminado correctamente.");
      setTimeout(() => setMensajeAlerta(null), 3500);
      router.refresh();
    } catch (error) {
      console.error("Error al eliminar:", error);
    } finally {
      setCargandoAccion(false);
    }
  };

  const iniciarEdicion = (m: Movimiento) => {
    setEditandoId(m.id);
    setEditDesc(m.descripcion);
    setEditMonto(String(m.monto));
    setEditTipo(m.tipo);
    setEditCat(m.categoria);
    setEditCuentaId(m.cuenta_id ? String(m.cuenta_id) : "");
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
  };

  const guardarEdicion = async (id: number) => {
    try {
      setCargandoAccion(true);
      const formData = new FormData();
      formData.append("descripcion", editDesc);
      formData.append("monto", editMonto);
      formData.append("tipo", editTipo);
      formData.append("categoria", editCat);
      formData.append("cuenta_id", editCuentaId);

      await editarMovimiento(id, formData);
      setEditandoId(null);
      setMensajeAlerta("Movimiento editado correctamente.");
      setTimeout(() => setMensajeAlerta(null), 3500);
      router.refresh();
    } catch (error) {
      console.error("Error al actualizar:", error);
    } finally {
      setCargandoAccion(false);
    }
  };

  if (!montado) {
    return <div className="bg-[#0E7490]/30 border border-[#BAE6FD]/20 p-6 rounded-3xl shadow-xl h-48 animate-pulse" />;
  }

  return (
    <div className="bg-[#0E7490]/30 border border-[#BAE6FD]/20 p-6 rounded-3xl shadow-xl backdrop-blur-md relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="text-xl font-bold text-[#F0FDFF]">Movimientos Recientes</h2>
        
        {/* Controles de Filtros */}
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          {/* Input de Búsqueda */}
          <div className="relative flex-1 md:w-60">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#BAE6FD]/60" />
            <input
              type="text"
              placeholder="Buscar movimiento..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full bg-[#082F49]/90 text-[#F0FDFF] border border-[#BAE6FD]/30 rounded-2xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E] placeholder:text-[#BAE6FD]/40 shadow-inner"
            />
          </div>

          {/* Filtro por Tipo */}
          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
            className="bg-[#082F49]/90 text-[#F0FDFF] border border-[#BAE6FD]/30 rounded-2xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E] cursor-pointer"
          >
            <option value="todos">Todos los tipos</option>
            <option value="ingreso">Ingresos</option>
            <option value="gasto">Gastos</option>
          </select>

          {/* Filtro por Categoría */}
          <select
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
            className="bg-[#082F49]/90 text-[#F0FDFF] border border-[#BAE6FD]/30 rounded-2xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E] cursor-pointer"
          >
            <option value="todas">Todas las categorías</option>
            {categoriasUnicas.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Alerta flotante de éxito */}
      {mensajeAlerta && (
        <div className="mb-4 p-3 rounded-2xl bg-[#22C55E]/20 border border-[#22C55E]/40 text-[#22C55E] text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4 shrink-0" />
          {mensajeAlerta}
        </div>
      )}

      {/* Listado */}
      {movimientosFiltrados.length === 0 ? (
        <div className="text-center py-12 text-[#BAE6FD]/60 italic text-sm">
          No se encontraron movimientos con los filtros seleccionados.
        </div>
      ) : (
        <div className="flex flex-col gap-3 max-h-[500px] overflow-y-auto pr-1">
          {movimientosFiltrados.map((m) => {
            const cuentaAsociada = cuentas.find((c) => c.id === m.cuenta_id);
            const estaEditando = editandoId === m.id;
            const estaConfirmandoBorrado = idEliminando === m.id;

            return (
              <div
                key={m.id}
                className="bg-[#082F49]/70 border border-[#BAE6FD]/15 p-4 rounded-2xl flex flex-col gap-3 hover:border-[#BAE6FD]/40 transition-all duration-200"
              >
                {estaEditando ? (
                  /* Formulario de Edición en Línea */
                  <div className="flex flex-col gap-3 w-full bg-[#082F49] p-4 rounded-xl border border-[#22C55E]/40">
                    <p className="text-xs font-bold text-[#22C55E] uppercase tracking-wider">Editando movimiento</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={editDesc}
                        onChange={(e) => setEditDesc(e.target.value)}
                        placeholder="Descripción"
                        className="bg-[#0E7490]/30 border border-[#BAE6FD]/30 rounded-xl px-3 py-2 text-sm text-[#F0FDFF] focus:outline-none focus:ring-2 focus:ring-[#22C55E]"
                      />
                      <input
                        type="number"
                        step="0.01"
                        value={editMonto}
                        onChange={(e) => setEditMonto(e.target.value)}
                        placeholder="Monto"
                        className="bg-[#0E7490]/30 border border-[#BAE6FD]/30 rounded-xl px-3 py-2 text-sm text-[#F0FDFF] focus:outline-none focus:ring-2 focus:ring-[#22C55E]"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <select
                        value={editTipo}
                        onChange={(e) => setEditTipo(e.target.value as "ingreso" | "gasto")}
                        className="bg-[#0E7490]/30 border border-[#BAE6FD]/30 rounded-xl px-3 py-2 text-sm text-[#F0FDFF] focus:outline-none focus:ring-2 focus:ring-[#22C55E]"
                      >
                        <option value="ingreso">Ingreso</option>
                        <option value="gasto">Gasto</option>
                      </select>
                      <input
                        type="text"
                        value={editCat}
                        onChange={(e) => setEditCat(e.target.value)}
                        placeholder="Categoría"
                        className="bg-[#0E7490]/30 border border-[#BAE6FD]/30 rounded-xl px-3 py-2 text-sm text-[#F0FDFF] focus:outline-none focus:ring-2 focus:ring-[#22C55E]"
                      />
                      <select
                        value={editCuentaId}
                        onChange={(e) => setEditCuentaId(e.target.value)}
                        className="bg-[#0E7490]/30 border border-[#BAE6FD]/30 rounded-xl px-3 py-2 text-sm text-[#F0FDFF] focus:outline-none focus:ring-2 focus:ring-[#22C55E]"
                      >
                        <option value="">Sin cuenta</option>
                        {cuentas.map((c) => (
                          <option key={c.id} value={c.id}>{c.nombre}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex justify-end gap-2 mt-1">
                      <button
                        onClick={cancelarEdicion}
                        disabled={cargandoAccion}
                        className="px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-xs font-bold text-[#F0FDFF] flex items-center gap-1 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" /> Cancelar
                      </button>
                      <button
                        onClick={() => guardarEdicion(m.id)}
                        disabled={cargandoAccion}
                        className="px-3 py-1.5 rounded-xl bg-[#22C55E] hover:bg-[#1eb355] text-xs font-extrabold text-[#082F49] flex items-center gap-1 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" /> {cargandoAccion ? "Guardando..." : "Guardar"}
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Vista Normal del Movimiento */
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl border ${
                          m.tipo === "ingreso"
                            ? "bg-[#22C55E]/20 border-[#22C55E]/30 text-[#22C55E]"
                            : "bg-rose-500/20 border-rose-500/30 text-rose-300"
                        }`}>
                          {m.tipo === "ingreso" ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
                        </div>
                        <div>
                          <h3 className="font-bold text-[#F0FDFF] text-base">{m.descripcion}</h3>
                          <p className="text-xs text-[#BAE6FD]/80 mt-0.5 font-medium">
                            {m.categoria} • <span className="text-[#22C55E] font-semibold">
                              {cuentaAsociada ? cuentaAsociada.nombre : "Sin cuenta"}
                            </span> • <span className="text-[#BAE6FD]/60">{m.fecha}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className={`text-lg font-extrabold ${
                          m.tipo === "ingreso" ? "text-[#22C55E]" : "text-rose-300"
                        }`}>
                          {m.tipo === "ingreso" ? "+" : "-"}${Number(m.monto).toLocaleString("es-AR")}
                        </div>

                        {/* Botones de Acción (Editar y Eliminar) */}
                        <div className="flex items-center gap-1.5 border-l border-[#BAE6FD]/20 pl-3">
                          <button
                            onClick={() => iniciarEdicion(m)}
                            title="Editar movimiento"
                            className="p-2 rounded-xl bg-[#0E7490]/40 hover:bg-[#0E7490] text-[#BAE6FD] hover:text-[#F0FDFF] transition-all cursor-pointer"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => confirmarEliminar(m.id)}
                            title="Eliminar movimiento"
                            className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/30 text-rose-300 transition-all cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Mensaje integrado de confirmación de borrado */}
                    {estaConfirmandoBorrado && (
                      <div className="bg-rose-500/15 border border-rose-500/40 p-3 rounded-xl flex items-center justify-between mt-1 animate-fadeIn">
                        <div className="flex items-center gap-2 text-rose-300 text-xs font-semibold">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>¿Seguro que querés eliminar este movimiento?</span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setIdEliminando(null)}
                            className="px-3 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-[11px] text-[#F0FDFF] font-medium cursor-pointer"
                          >
                            Cancelar
                          </button>
                          <button
                            onClick={() => ejecutarEliminacion(m.id)}
                            disabled={cargandoAccion}
                            className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-[11px] text-[#F0FDFF] font-bold cursor-pointer"
                          >
                            {cargandoAccion ? "Eliminando..." : "Sí, eliminar"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}