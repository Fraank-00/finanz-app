import { supabase } from "@/lib/supabase";
import { Wallet, TrendingUp, TrendingDown, Calendar, LayoutDashboard, PieChart, CreditCard, PlusCircle } from "lucide-react";
import { GraficoFinanzas } from "@/components/GraficoFinanzas";
import { ClientSideMovimientos } from "@/components/ClientSideMovimientos";
import { FormularioMovimiento } from "@/components/FormularioMovimiento";

export interface Cuenta {
  id: number;
  nombre: string;
  tipo: string;
  color: string;
}

export interface Movimiento {
  id: number;
  descripcion: string;
  monto: number;
  tipo: "ingreso" | "gasto";
  categoria: string;
  fecha: string;
  cuenta_id: number | null;
}

export const instant = false;

export default async function Home() {
  const { data: movimientos, error } = await supabase
    .from("movimientos")
    .select("*")
    .order("fecha", { ascending: false });

  if (error) {
    console.error("Error al cargar movimientos:", error);
  }

  const listaMovimientos = movimientos || [];

  const { data: cuentas, error: cuentasError } = await supabase
    .from("cuentas")
    .select("*");

  if (cuentasError) {
    console.error("Error al cargar cuentas:", cuentasError);
  }

  const listaCuentas: Cuenta[] = cuentas || [];
  const cuentasConSaldo = listaCuentas.map((cuenta) => {
    const movimientosCuenta = listaMovimientos.filter(
      (movimiento) => movimiento.cuenta_id === cuenta.id,
    );
    const ingresos = movimientosCuenta
      .filter((movimiento) => movimiento.tipo === "ingreso")
      .reduce((total, movimiento) => total + Number(movimiento.monto), 0);
    const gastos = movimientosCuenta
      .filter((movimiento) => movimiento.tipo === "gasto")
      .reduce((total, movimiento) => total + Number(movimiento.monto), 0);

    return { ...cuenta, saldo: ingresos - gastos };
  });

  const totalIngresos = listaMovimientos
    .filter((m) => m.tipo === "ingreso")
    .reduce((acc, m) => acc + Number(m.monto), 0);

  const totalGastos = listaMovimientos
    .filter((m) => m.tipo === "gasto")
    .reduce((acc, m) => acc + Number(m.monto), 0);

  const saldoActual = totalIngresos - totalGastos;

  const fechaActual = new Date();
  const mesActualStr = String(fechaActual.getMonth() + 1).padStart(2, '0');
  const anioActualStr = String(fechaActual.getFullYear());
  const prefijoMesActual = `${anioActualStr}-${mesActualStr}`;

  const movimientosMes = listaMovimientos.filter((m) => m.fecha && m.fecha.startsWith(prefijoMesActual));

  const ingresosMes = movimientosMes
    .filter((m) => m.tipo === "ingreso")
    .reduce((acc, m) => acc + Number(m.monto), 0);

  const gastosMes = movimientosMes
    .filter((m) => m.tipo === "gasto")
    .reduce((acc, m) => acc + Number(m.monto), 0);

  return (
    <main id="dashboard" className="min-h-screen bg-[#082F49] text-[#F0FDFF] p-6 md:p-12 font-sans pb-28 md:pb-12 relative overflow-hidden scroll-smooth">
      
      {/* Destellos de luz ambiental basados en la paleta (#0E7490 y #22C55E) */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#0E7490]/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-[#22C55E]/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 relative z-10">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#F0FDFF] flex items-center gap-3">
            <div className="p-2.5 bg-[#0E7490]/30 border border-[#BAE6FD]/20 rounded-2xl text-[#BAE6FD]">
              <Wallet className="w-7 h-7" />
            </div>
            Finanz<span className="text-[#22C55E]">App</span>
          </h1>
          <p className="text-[#BAE6FD]/80 text-sm mt-1 font-medium">
            Panel financiero.
          </p>
        </div>
      </header>

      {/* Tarjetas de Resumen Histórico */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 relative z-10">
        <div className="bg-[#0E7490]/30 border border-[#BAE6FD]/20 p-6 rounded-3xl shadow-xl hover:-translate-y-1.5 hover:border-[#BAE6FD]/40 hover:shadow-2xl transition-all duration-300 backdrop-blur-md">
          <p className="text-[#BAE6FD] text-xs font-semibold tracking-wider uppercase">Saldo Actual (Total)</p>
          <p className="text-3xl font-extrabold text-[#F0FDFF] mt-2">
            ${saldoActual.toLocaleString()}
          </p>
        </div>

        <div className="bg-[#0E7490]/30 border border-[#BAE6FD]/20 p-6 rounded-3xl shadow-xl hover:-translate-y-1.5 hover:border-[#22C55E]/40 hover:shadow-2xl transition-all duration-300 backdrop-blur-md">
          <div className="flex justify-between items-center">
            <p className="text-[#BAE6FD] text-xs font-semibold tracking-wider uppercase">Ingresos Totales</p>
            <div className="p-2.5 bg-[#22C55E]/20 border border-[#22C55E]/30 text-[#22C55E] rounded-2xl">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-[#22C55E] mt-2">
            +${totalIngresos.toLocaleString()}
          </p>
        </div>

        <div className="bg-[#0E7490]/30 border border-[#BAE6FD]/20 p-6 rounded-3xl shadow-xl hover:-translate-y-1.5 hover:border-rose-400/40 hover:shadow-2xl transition-all duration-300 backdrop-blur-md">
          <div className="flex justify-between items-center">
            <p className="text-[#BAE6FD] text-xs font-semibold tracking-wider uppercase">Gastos Totales</p>
            <div className="p-2.5 bg-rose-500/20 border border-rose-500/30 text-rose-300 rounded-2xl">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-rose-300 mt-2">
            -${totalGastos.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Tarjetas de Resumen del Mes Actual */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 relative z-10">
        <div className="bg-[#0E7490]/20 border border-[#BAE6FD]/15 p-5 rounded-3xl shadow-lg flex items-center justify-between hover:-translate-y-1.5 hover:border-[#22C55E]/30 transition-all duration-300 backdrop-blur-md">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-[#22C55E]" />
              <p className="text-xs uppercase tracking-wider font-semibold text-[#BAE6FD]">Ingresos del Mes</p>
            </div>
            <p className="text-2xl font-extrabold text-[#22C55E]">+${ingresosMes.toLocaleString()}</p>
          </div>
          <div className="p-3 bg-[#22C55E]/20 border border-[#22C55E]/30 text-[#22C55E] rounded-2xl">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-[#0E7490]/20 border border-[#BAE6FD]/15 p-5 rounded-3xl shadow-lg flex items-center justify-between hover:-translate-y-1.5 hover:border-rose-400/30 transition-all duration-300 backdrop-blur-md">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-rose-300" />
              <p className="text-xs uppercase tracking-wider font-semibold text-[#BAE6FD]">Gastos del Mes</p>
            </div>
            <p className="text-2xl font-extrabold text-rose-300">-${gastosMes.toLocaleString()}</p>
          </div>
          <div className="p-3 bg-rose-500/20 border border-rose-500/30 text-rose-300 rounded-2xl">
            <TrendingDown className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Sección de Cuentas / Billeteras */}
      <div id="cuentas" className="mb-10 relative z-10 scroll-mt-6">
        <h2 className="text-xl font-bold text-[#F0FDFF] mb-4 tracking-tight">Cuentas / Billeteras</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cuentasConSaldo.map((cuenta) => (
            <div key={cuenta.id} className="bg-[#0E7490]/30 border border-[#BAE6FD]/20 p-5 rounded-3xl shadow-xl hover:-translate-y-1.5 hover:border-[#BAE6FD]/40 hover:shadow-2xl transition-all duration-300 backdrop-blur-md">
              <div className="flex justify-between items-center">
                <p className="text-[#BAE6FD] text-xs font-semibold uppercase tracking-wider">{cuenta.nombre}</p>
                <span className="text-[10px] uppercase tracking-wider px-3 py-1 rounded-full bg-[#082F49]/80 border border-[#BAE6FD]/30 text-[#BAE6FD] font-bold">
                  {cuenta.tipo}
                </span>
              </div>
              <p className="text-2xl font-extrabold text-[#F0FDFF] mt-3">${cuenta.saldo.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Grid Principal: Formulario Validado + Listado Interactivo */}
      <div id="movimientos" className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10 relative z-10 scroll-mt-6">
        
        {/* Formulario con Zod y React Hook Form */}
        <FormularioMovimiento cuentas={listaCuentas} />

        {/* Listado Interactivo con Filtros Avanzados */}
        <div className="lg:col-span-2">
          <ClientSideMovimientos movimientos={listaMovimientos} cuentas={listaCuentas} />
        </div>

      </div>

      {/* Sección de Gráficos */}
      <div id="graficos" className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10 scroll-mt-6">
        <div className="bg-[#0E7490]/30 border border-[#BAE6FD]/20 p-6 rounded-3xl shadow-xl hover:-translate-y-1.5 hover:border-[#BAE6FD]/40 hover:shadow-2xl transition-all duration-300 backdrop-blur-md">
          <h2 className="text-xl font-bold text-[#F0FDFF] mb-4">Gastos por Categoría</h2>
          <GraficoFinanzas movimientos={listaMovimientos} tipo="gasto" />
        </div>

        <div className="bg-[#0E7490]/30 border border-[#BAE6FD]/20 p-6 rounded-3xl shadow-xl hover:-translate-y-1.5 hover:border-[#BAE6FD]/40 hover:shadow-2xl transition-all duration-300 backdrop-blur-md">
          <h2 className="text-xl font-bold text-[#F0FDFF] mb-4">Ingresos por Categoría</h2>
          <GraficoFinanzas movimientos={listaMovimientos} tipo="ingreso" />
        </div>
      </div>

      {/* Barra de navegación flotante inferior funcional (Scroll Suave) */}
      <nav className="md:hidden fixed bottom-4 left-4 right-4 bg-[#082F49]/95 border border-[#BAE6FD]/30 backdrop-blur-xl px-6 py-3 rounded-2xl shadow-2xl flex justify-between items-center z-50">
        <a href="#dashboard" className="flex flex-col items-center gap-1 text-[#22C55E]">
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Inicio</span>
        </a>
        <a href="#cuentas" className="flex flex-col items-center gap-1 text-[#BAE6FD]/70 hover:text-[#F0FDFF]">
          <CreditCard className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Cuentas</span>
        </a>
        <a href="#movimientos" className="flex flex-col items-center gap-1 text-[#BAE6FD]/70 hover:text-[#F0FDFF]">
          <PlusCircle className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Movimientos</span>
        </a>
        <a href="#graficos" className="flex flex-col items-center gap-1 text-[#BAE6FD]/70 hover:text-[#F0FDFF]">
          <PieChart className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Gráficos</span>
        </a>
      </nav>
    </main>
  );
}