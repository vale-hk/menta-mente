import { useState } from "react";
import { Printer } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { pdfAdmin, type FilaAdmin } from "@/lib/pdfInformes";

type Periodo = "todo" | "dia" | "semana" | "mes" | "anio";
const selectCls = "h-11 w-full rounded-md border-2 border-input bg-white px-3 text-slate-900 dark:bg-black dark:text-white";
const ETIQUETA_P: Record<Periodo, string> = { todo: "todo el período registrado", dia: "el día de hoy", semana: "la última semana", mes: "el mes actual", anio: "el año actual" };

function enPeriodo(iso: string | null, p: Periodo) {
  if (p === "todo") return true;
  if (!iso) return false;
  const d = new Date(iso), h = new Date();
  if (p === "semana") return h.getTime() - d.getTime() <= 7 * 86400000 && d.getTime() <= h.getTime() + 60000;
  if (d.getFullYear() !== h.getFullYear()) return false;
  if (p === "anio") return true;
  if (d.getMonth() !== h.getMonth()) return false;
  return p === "mes" || d.getDate() === h.getDate();
}
function enEdad(e: number | null, r: string) {
  if (r === "todas") return true;
  if (e === null) return false;
  if (r === "60-69") return e >= 60 && e <= 69;
  if (r === "70-79") return e >= 70 && e <= 79;
  return e >= 80;
}
const prom = (v: (number | null)[]) => {
  const n = v.filter((x): x is number => x !== null);
  return n.length ? Math.round(n.reduce((a, b) => a + b, 0) / n.length) : 0;
};

function interpretar(n: number, periodo: Periodo, edad: string, sexo: string, comuna: string, areas: { etiqueta: string; valor: number }[]) {
  const f: string[] = [];
  if (comuna !== "todas") f.push(`comuna ${comuna}`);
  if (sexo !== "todos") f.push(`sexo ${sexo}`);
  if (edad !== "todas") f.push(`tramo etario ${edad} años`);
  const filtros = f.length ? `, aplicando el filtro de ${f.join(" y ")}` : ", sin filtros demográficos adicionales";
  if (n === 0) return `Durante ${ETIQUETA_P[periodo]}${filtros}, no se registraron evaluaciones. Se sugiere ampliar el rango de tiempo o los filtros.`;
  const orden = [...areas].sort((a, b) => b.valor - a.valor);
  const mejor = orden[0]!, peor = orden[orden.length - 1]!;
  const general = prom(areas.map((a) => a.valor));
  const nivel = general >= 90 ? "sobresaliente" : general >= 76 ? "bueno" : general >= 46 ? "intermedio" : "bajo";
  let t = `Durante ${ETIQUETA_P[periodo]}${filtros}, se evaluaron ${n} registro${n === 1 ? "" : "s"} de personas usuarias. `;
  t += `El área de mayor rendimiento fue ${mejor.etiqueta} (${mejor.valor}%), mientras que ${peor.etiqueta} requiere mayor atención (${peor.valor}%). `;
  t += `El logro promedio global del grupo fue de ${general}%, lo que representa un desempeño ${nivel}. `;
  const bajas = areas.filter((a) => a.valor <= 45).map((a) => a.etiqueta);
  if (bajas.length) t += `Se recomienda reforzar la estimulación en ${bajas.join(", ")}, con actividades graduadas y sesiones breves y frecuentes. `;
  else if (mejor.valor - peor.valor >= 20) t += `La diferencia de ${mejor.valor - peor.valor} puntos entre áreas sugiere priorizar ejercicios de ${peor.etiqueta} para equilibrar el perfil cognitivo. `;
  else t += `El perfil cognitivo del grupo es homogéneo entre áreas; se sugiere mantener la frecuencia actual de práctica. `;
  return t + "Este resumen es orientativo y no reemplaza la evaluación fonoaudiológica individual.";
}

export function ImprimirInformeAdmin({ fuente, comunas }: { fuente: FilaAdmin[]; comunas: string[] }) {
  const [abierto, setAbierto] = useState(false);
  const [periodo, setPeriodo] = useState<Periodo>("mes");
  const [edad, setEdad] = useState("todas");
  const [sexo, setSexo] = useState("todos");
  const [comuna, setComuna] = useState("todas");
  const [generando, setGenerando] = useState(false);

  const filas = fuente.filter((r) => enPeriodo(r.ultimaActividad, periodo) && enEdad(r.edad, edad) && (sexo === "todos" || r.sexo === sexo) && (comuna === "todas" || r.comuna === comuna));

  async function imprimir(todo: boolean) {
    setGenerando(true);
    const datos = todo ? fuente : filas;
    const filtros = todo ? "Toda la información" : `Período: ${ETIQUETA_P[periodo]} · Edad: ${edad} · Sexo: ${sexo} · Comuna: ${comuna}`;
    const areas = [
      { etiqueta: "Atención", valor: prom(datos.map((r) => r.atencion)) },
      { etiqueta: "Memoria", valor: prom(datos.map((r) => r.memoria)) },
      { etiqueta: "Funciones ejecutivas", valor: prom(datos.map((r) => r.funciones)) },
      { etiqueta: "Lenguaje", valor: prom(datos.map((r) => r.lenguaje)) },
    ];
    const texto = todo ? interpretar(datos.length, "todo", "todas", "todos", "todas", areas) : interpretar(datos.length, periodo, edad, sexo, comuna, areas);
    try {
      await pdfAdmin(datos, filtros, areas, texto);
      setAbierto(false);
    } finally {
      setGenerando(false);
    }
  }

  return (
    <Dialog open={abierto} onOpenChange={setAbierto}>
      <DialogTrigger asChild>
        <Button className="h-12 gap-2 bg-brand px-5 text-base font-semibold text-brand-foreground hover:bg-brand/90 dark:border-2 dark:border-white">
          <Printer className="size-5" aria-hidden="true" /> Imprimir Informe
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl">Imprimir informe clínico</DialogTitle>
          <DialogDescription>Aplique filtros antes de generar el PDF o imprima toda la información.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-1"><Label htmlFor="p-periodo">Rango de fechas</Label>
            <select id="p-periodo" className={selectCls} value={periodo} onChange={(e) => setPeriodo(e.target.value as Periodo)}>
              <option value="dia">Por Día (hoy)</option><option value="semana">Por Semana (últimos 7 días)</option><option value="mes">Por Mes (actual)</option><option value="anio">Por Año (actual)</option><option value="todo">Todo</option>
            </select></div>
          <div className="grid gap-1"><Label htmlFor="p-edad">Edad</Label>
            <select id="p-edad" className={selectCls} value={edad} onChange={(e) => setEdad(e.target.value)}>
              <option value="todas">Todas</option><option value="60-69">60–69</option><option value="70-79">70–79</option><option value="80+">80+</option>
            </select></div>
          <div className="grid gap-1"><Label htmlFor="p-sexo">Sexo</Label>
            <select id="p-sexo" className={selectCls} value={sexo} onChange={(e) => setSexo(e.target.value)}>
              <option value="todos">Todos</option>
              {[...new Set(fuente.map((r) => r.sexo).filter(Boolean))].map((s) => <option key={s} value={s!}>{s}</option>)}
            </select></div>
          <div className="grid gap-1"><Label htmlFor="p-comuna">Comuna</Label>
            <select id="p-comuna" className={selectCls} value={comuna} onChange={(e) => setComuna(e.target.value)}>
              <option value="todas">Todas</option>
              {comunas.map((c) => <option key={c} value={c}>{c}</option>)}
            </select></div>
        </div>
        <p className="text-sm text-muted-foreground" role="status">{filas.length} registros coinciden con los filtros.</p>
        <div className="flex flex-wrap gap-3">
          <Button className="h-11 flex-1" disabled={generando || filas.length === 0} onClick={() => imprimir(false)}>Imprimir con filtros</Button>
          <Button variant="outline" className="h-11 flex-1 border-2" disabled={generando} onClick={() => imprimir(true)}>Imprimir toda la información</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
