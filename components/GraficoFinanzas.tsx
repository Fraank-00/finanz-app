"use client";

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

interface MovimientoGrafico {
  categoria: string;
  monto: number;
  tipo: "ingreso" | "gasto";
}

interface GraficoFinanzasProps {
  movimientos: MovimientoGrafico[];
  tipo: "ingreso" | "gasto";
}

export function GraficoFinanzas({ movimientos, tipo }: GraficoFinanzasProps) {
  const movimientosFiltrados = movimientos.filter((m) => m.tipo === tipo);

  const acumuladoPorCategoria = movimientosFiltrados.reduce((acc: { [key: string]: number }, curr) => {
    acc[curr.categoria] = (acc[curr.categoria] || 0) + Number(curr.monto);
    return acc;
  }, {});

  const datosGrafico = Object.keys(acumuladoPorCategoria).map((cat) => ({
    categoria: cat,
    total: acumuladoPorCategoria[cat],
  }));

  const mensajeVacio = 
    tipo === "gasto" 
      ? "Agregá algunos gastos para ver el gráfico por categoría." 
      : "Agregá algunos ingresos para ver el gráfico de entradas.";

  if (datosGrafico.length === 0) {
    return (
      <div className="text-center py-8 text-[#BAE6FD]/60 italic text-sm">
        {mensajeVacio}
      </div>
    );
  }

  const colorBarra = tipo === "ingreso" ? "#22C55E" : "#f43f5e";

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={datosGrafico} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#0E7490" opacity={0.3} />
          <XAxis dataKey="categoria" stroke="#BAE6FD" fontSize={12} tickLine={false} />
          <YAxis stroke="#BAE6FD" fontSize={12} tickLine={false} />
          
          {/* cursor={false} desactiva por completo esa barra gris/blanca de fondo al hacer hover */}
          <Tooltip 
            cursor={false}
            contentStyle={{ 
              backgroundColor: "#082F49", 
              borderColor: "#0E7490", 
              borderRadius: "1rem", 
              color: "#F0FDFF",
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)"
            }}
          />
          <Bar dataKey="total" fill={colorBarra} radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}