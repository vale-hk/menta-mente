import { useState } from "react";
import { Printer } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { categorias } from "@/data/ejercicios";
import { pdfUsuario } from "@/lib/pdfInformes";

type Registro = { categoria: string; nombre_ejercicio: string; puntaje: number; fecha_ejecucion: string };
const MAX_AREA = 70;

export function ImprimirInformeUsuario({ nombre, registros }: { nombre: string; registros: Registro[] }) {
  const [abierto, setAbierto] = useState(false);
  const [generando, setGenerando] = useState(false);

  async function generar(tipo: "dia" | "semana" | "mes" | "anio") {
    setGenerando(true);
    const hoy = new Date();
    const clave = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const mismoDia = (d: Date) => d.toDateString() === hoy.toDateString();
    const inicioAnio = new Date(hoy.getFullYear(), hoy.getMonth() - 11, 1).getTime();
    const propios = registros.filter((r) => {
      const d = new Date(r.fecha_ejecucion);
      if (tipo === "dia") return mismoDia(d);
      if (tipo === "semana") return hoy.getTime() - d.getTime() <= 7 * 86400000;
      if (tipo === "mes") return clave(d) === clave(hoy);
      return d.getTime() >= inicioAnio;
    });

    const areas = categorias.map((c) => {
      const del = propios.filter((r) => r.categoria === c.id);
      const ult = new Map<string, number>();
      del.forEach((r) => { if (!ult.has(r.nombre_ejercicio)) ult.set(r.nombre_ejercicio, r.puntaje); });
      const puntos = [...ult.values()].reduce((s, v) => s + v, 0);
      return { titulo: c.titulo, puntos, maximo: MAX_AREA, pct: Math.min(100, Math.round((puntos / MAX_AREA) * 100)), intentos: del.length };
    });
    const puntos = areas.reduce((s, a) => s + a.puntos, 0);
    const maximo = MAX_AREA * categorias.length;

    const evolucion = tipo !== "anio"
      ? areas.map((a) => ({ etiqueta: a.titulo, valor: a.pct }))
      : Array.from({ length: 12 }, (_, i) => {
          const d = new Date(hoy.getFullYear(), hoy.getMonth() - 11 + i, 1);
          const m = propios.filter((r) => clave(new Date(r.fecha_ejecucion)) === clave(d));
          return { etiqueta: new Intl.DateTimeFormat("es-CL", { month: "short" }).format(d), valor: m.length ? Math.round((m.reduce((s, r) => s + r.puntaje, 0) / m.length) * 10) : 0 };
        });

    const etiquetas = {
      dia: `diario ${hoy.toLocaleDateString("es-CL")}`,
      semana: "semanal (últimos 7 días)",
      mes: `mensual ${new Intl.DateTimeFormat("es-CL", { month: "long", year: "numeric" }).format(hoy)}`,
      anio: "anual (últimos 12 meses)",
    };
    try {
      await pdfUsuario({
        nombre, periodo: etiquetas[tipo],
        pctGeneral: Math.min(100, Math.round((puntos / maximo) * 100)), puntos, maximo, areas, evolucion,
        intentos: propios.map((r) => ({
          fecha: new Date(r.fecha_ejecucion).toLocaleDateString("es-CL"),
          area: categorias.find((c) => c.id === r.categoria)?.titulo ?? r.categoria,
          ejercicio: r.nombre_ejercicio, puntaje: r.puntaje,
        })),
      });
      setAbierto(false);
    } finally {
      setGenerando(false);
    }
  }

  const btn = "min-h-14 rounded-lg border-2 border-card-border bg-card px-5 py-3 text-lg font-semibold hover:bg-accent disabled:opacity-50";
  return (
    <Dialog open={abierto} onOpenChange={setAbierto}>
      <DialogTrigger asChild>
        <button type="button" className="flex min-h-12 items-center gap-2 rounded-lg bg-brand px-5 py-2 text-lg font-semibold text-brand-foreground dark:border-2 dark:border-white">
          <Printer className="size-6" aria-hidden="true" /> Imprimir Informe
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">¿Qué período desea imprimir?</DialogTitle>
          <DialogDescription className="text-base">Se descargará un informe en PDF con sus resultados y su gráfico de evolución.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 sm:grid-cols-2">
          <button type="button" className={btn} disabled={generando} onClick={() => generar("dia")}>Por Día (hoy)</button>
          <button type="button" className={btn} disabled={generando} onClick={() => generar("semana")}>Por Semana</button>
          <button type="button" className={btn} disabled={generando} onClick={() => generar("mes")}>Por Mes</button>
          <button type="button" className={btn} disabled={generando} onClick={() => generar("anio")}>Por Año</button>
        </div>
        {generando && <p role="status">Preparando su informe…</p>}
      </DialogContent>
    </Dialog>
  );
}
