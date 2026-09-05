import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { MintLeaf } from "@/components/MintLeaf";
import { useTema } from "@/hooks/useTema";
import { iniciarSesionAdmin, validarTokenAdmin } from "@/lib/admin.functions";
import { obtenerRegistrosAdmin, type RegistroAdminDB } from "@/lib/adminDatos.functions";
import { generarDatosDemo } from "@/lib/adminDemo.functions";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { comunasRM, registrosAdmin, type RegistroAdmin } from "@/data/adminMock";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const CLAVE_SESION = "menta-admin-token";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Panel de administración — Menta" },
      {
        name: "description",
        content:
          "Panel privado de Menta con indicadores de participación, filtros por edad, sexo y comuna, y rendimiento cognitivo por usuario.",
      },
      { property: "og:title", content: "Panel de administración — Menta" },
      {
        property: "og:description",
        content: "Indicadores y tabla de rendimiento cognitivo de las personas usuarias de Menta.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Admin,
});

function Admin() {
  const { oscuro, alternar } = useTema();
  const [autorizado, setAutorizado] = useState<boolean | null>(null);

  const validar = useServerFn(validarTokenAdmin);

  useEffect(() => {
    const token = sessionStorage.getItem(CLAVE_SESION);
    if (!token) {
      setAutorizado(false);
      return;
    }
    validar({ data: { token } })
      .then((r) => {
        if (!r.valido) sessionStorage.removeItem(CLAVE_SESION);
        setAutorizado(r.valido);
      })
      .catch(() => setAutorizado(false));
  }, [validar]);

  function salir() {
    sessionStorage.removeItem(CLAVE_SESION);
    setAutorizado(false);
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <Link to="/" className="flex items-center gap-3">
            <MintLeaf className="h-9 w-9" />
            <span className="text-2xl font-semibold tracking-tight">Menta</span>
            <Badge variant="secondary" className="ml-1">
              Administración
            </Badge>
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={alternar} aria-pressed={oscuro}>
              {oscuro ? "Modo claro" : "Modo oscuro"}
            </Button>
            {autorizado ? (
              <Button variant="ghost" onClick={salir}>
                Cerrar panel
              </Button>
            ) : null}
          </div>
        </div>
      </header>

      {autorizado === null ? (
        <p className="mx-auto max-w-6xl px-4 py-16 text-lg text-muted-foreground">Verificando acceso…</p>
      ) : autorizado ? (
        <Dashboard />
      ) : (
        <LoginAdmin onOk={() => setAutorizado(true)} />
      )}
    </div>
  );
}

function LoginAdmin({ onOk }: { onOk: () => void }) {
  const ingresar = useServerFn(iniciarSesionAdmin);
  const [clave, setClave] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setCargando(true);
    try {
      const r = await ingresar({ data: { clave } });
      if (!r.ok) {
        setError("La clave no es correcta.");
        return;
      }
      sessionStorage.setItem(CLAVE_SESION, r.token);
      onOk();
    } catch {
      setError("No fue posible validar el acceso. Intente nuevamente.");
    } finally {
      setCargando(false);
    }
  }

  return (
    <main className="mx-auto flex max-w-md flex-col justify-center px-4 py-16">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Acceso restringido</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-6 text-base text-muted-foreground">
            Este panel es exclusivo del equipo administrador de Menta. Ingrese su clave de acceso.
          </p>
          <form onSubmit={enviar} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="clave-admin" className="text-base">
                Clave de administración
              </Label>
              <Input
                id="clave-admin"
                type="password"
                autoComplete="current-password"
                value={clave}
                onChange={(e) => setClave(e.target.value)}
                className="h-12 text-lg"
                required
              />
            </div>
            {error ? (
              <p role="alert" className="text-base font-medium text-destructive">
                {error}
              </p>
            ) : null}
            <Button type="submit" className="h-12 w-full text-lg" disabled={cargando}>
              {cargando ? "Verificando…" : "Entrar al panel"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}

type RangoEdad = "todas" | "60-69" | "70-79" | "80+";

function enRango(edad: number, rango: RangoEdad) {
  if (rango === "todas") return true;
  if (rango === "60-69") return edad >= 60 && edad <= 69;
  if (rango === "70-79") return edad >= 70 && edad <= 79;
  return edad >= 80;
}

function promedio(nums: number[]) {
  if (nums.length === 0) return 0;
  return Math.round(nums.reduce((a, b) => a + b, 0) / nums.length);
}

function moda(valores: string[]) {
  const cuenta = new Map<string, number>();
  valores.forEach((v) => cuenta.set(v, (cuenta.get(v) ?? 0) + 1));
  let mejor = "—";
  let max = 0;
  cuenta.forEach((n, v) => {
    if (n > max) {
      max = n;
      mejor = v;
    }
  });
  return { valor: mejor, cantidad: max };
}

function fechaCorta(iso: string) {
  return new Date(iso).toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

const CLASE_SELECT_CONTENT = "bg-white text-slate-900 dark:bg-black dark:text-white";
const CLASE_SELECT_ITEM =
  "focus:bg-emerald-100 focus:text-emerald-950 data-[state=checked]:bg-emerald-100 data-[state=checked]:text-emerald-950 dark:focus:bg-emerald-900 dark:focus:text-white dark:data-[state=checked]:bg-emerald-900 dark:data-[state=checked]:text-white";

/** Código de colores de logro solicitado para la tabla. */
function tonoLogro(valor: number) {
  if (valor <= 45) return { texto: "text-red-600", fondo: "bg-red-100 dark:bg-red-950/60", hex: "#dc2626" };
  if (valor <= 75)
    return { texto: "text-yellow-500", fondo: "bg-yellow-100 dark:bg-yellow-950/60", hex: "#eab308" };
  if (valor <= 89)
    return { texto: "text-emerald-400", fondo: "bg-emerald-100 dark:bg-emerald-950/60", hex: "#34d399" };
  return { texto: "text-green-800", fondo: "bg-green-100 dark:bg-green-950/60", hex: "#166534" };
}

function Puntaje({ valor }: { valor: number | null }) {
  if (valor === null) {
    return <span className="text-sm text-muted-foreground">Sin datos</span>;
  }
  const tono = tonoLogro(valor);
  return (
    <span
      className={`inline-block rounded-md px-2 py-1 text-sm font-bold ${tono.fondo} ${tono.texto}`}
    >
      {valor}%
    </span>
  );
}

function aRegistroDB(r: RegistroAdmin): RegistroAdminDB {
  return {
    id: r.id,
    usuario: r.usuario,
    edad: r.edad,
    sexo: r.sexo,
    comuna: r.comuna,
    atencion: r.atencion,
    memoria: r.memoria,
    funciones: r.funciones,
    lenguaje: r.lenguaje,
    ultimaActividad: r.ultimaActividad,
  };
}

const AREAS = [
  { clave: "atencion", nombre: "Atención" },
  { clave: "memoria", nombre: "Memoria" },
  { clave: "funciones", nombre: "Funciones ejecutivas" },
  { clave: "lenguaje", nombre: "Lenguaje" },
] as const;

function Dashboard() {
  const [rango, setRango] = useState<RangoEdad>("todas");
  const [sexo, setSexo] = useState<string>("todos");
  const [comuna, setComuna] = useState<string>("todas");

  const cargarRegistros = useServerFn(obtenerRegistrosAdmin);
  const generarDemo = useServerFn(generarDatosDemo);
  const [reales, setReales] = useState<RegistroAdminDB[] | null>(null);
  const [generando, setGenerando] = useState(false);
  const [mensajeDemo, setMensajeDemo] = useState("");

  useEffect(() => {
    const token = sessionStorage.getItem(CLAVE_SESION);
    if (!token) return;
    cargarRegistros({ data: { token } })
      .then((r) => setReales(r.ok ? r.registros : []))
      .catch(() => setReales([]));
  }, [cargarRegistros]);

  async function generarDatos() {
    const token = sessionStorage.getItem(CLAVE_SESION);
    if (!token || generando) return;
    setGenerando(true);
    setMensajeDemo("");
    try {
      const r = await generarDemo({ data: { token } });
      setMensajeDemo(r.mensaje);
      const act = await cargarRegistros({ data: { token } });
      setReales(act.ok ? act.registros : []);
    } catch {
      setMensajeDemo("No fue posible generar los datos de demostración.");
    } finally {
      setGenerando(false);
    }
  }

  const conDatosReales = (reales?.length ?? 0) > 0;
  const fuente: RegistroAdminDB[] = useMemo(
    () => (conDatosReales ? reales! : registrosAdmin.map(aRegistroDB)),
    [conDatosReales, reales],
  );

  const comunas = useMemo(() => {
    const set = new Set<string>(comunasRM as readonly string[]);
    fuente.forEach((r) => r.comuna && set.add(r.comuna));
    return Array.from(set).sort((a, b) => a.localeCompare(b, "es"));
  }, [fuente]);

  const filtrados = useMemo(
    () =>
      fuente.filter(
        (r) =>
          (rango === "todas" || (r.edad !== null && enRango(r.edad, rango))) &&
          (sexo === "todos" || r.sexo === sexo) &&
          (comuna === "todas" || r.comuna === comuna),
      ),
    [fuente, rango, sexo, comuna],
  );

  const areas = useMemo(
    () =>
      AREAS.map((a) => ({
        nombre: a.nombre,
        valor: promedio(filtrados.map((r) => r[a.clave]).filter((v): v is number => v !== null)),
      })),
    [filtrados],
  );

  const kpis = useMemo(() => {
    const conDatos = areas.filter((a) => a.valor > 0);
    const orden = [...conDatos].sort((a, b) => b.valor - a.valor);
    return {
      total: filtrados.length,
      comunaTop: moda(filtrados.map((r) => r.comuna ?? "Sin registrar")),
      edad: promedio(filtrados.map((r) => r.edad).filter((v): v is number => v !== null)),
      mejor: orden[0],
      peor: orden[orden.length - 1],
    };
  }, [areas, filtrados]);

  const limpiar = () => {
    setRango("todas");
    setSexo("todos");
    setComuna("todas");
  };

  return (
    <main className="mx-auto max-w-6xl space-y-8 px-4 py-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Panel de administración</h1>
        <p className="mt-2 text-base text-muted-foreground">
          {reales === null
            ? "Cargando información de la nube…"
            : conDatosReales
              ? "Indicadores calculados con la actividad real registrada por las personas usuarias de Menta."
              : "Aún no hay actividad registrada en la nube: se muestran datos de demostración."}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button variant="secondary" onClick={generarDatos} disabled={generando}>
            {generando ? "Generando datos…" : "Generar 50 usuarios de demostración"}
          </Button>
          {mensajeDemo ? (
            <p role="status" className="text-sm text-muted-foreground">
              {mensajeDemo}
            </p>
          ) : null}
        </div>
      </div>

      <section aria-label="Resumen general" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi titulo="Total de usuarios" valor={String(kpis.total)} detalle="registros visibles" />
        <Kpi
          titulo="Comuna con mayor participación"
          valor={kpis.total ? kpis.comunaTop.valor : "—"}
          detalle={kpis.total ? `${kpis.comunaTop.cantidad} usuarios` : "sin datos"}
        />
        <Kpi
          titulo="Área con mayor logro"
          valor={kpis.mejor?.nombre ?? "—"}
          detalle={kpis.mejor ? `${kpis.mejor.valor}% de logro promedio` : "sin datos"}
        />
        <Kpi
          titulo="Área con menor logro"
          valor={kpis.peor?.nombre ?? "—"}
          detalle={kpis.peor ? `${kpis.peor.valor}% de logro promedio` : "sin datos"}
        />
      </section>

      <section aria-label="Rendimiento promedio por área">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Rendimiento promedio por área cognitiva</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={areas} margin={{ top: 8, right: 8, bottom: 40, left: -8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.15} />
                  <XAxis
                    dataKey="nombre"
                    interval={0}
                    angle={-35}
                    textAnchor="end"
                    height={60}
                    tick={{ fontSize: 11, fill: "currentColor" }}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 12, fill: "currentColor" }}
                    label={{ value: "% logro", angle: -90, position: "insideLeft", fontSize: 12 }}
                  />
                  <Tooltip
                    formatter={(v: number) => [`${v}%`, "Logro promedio"]}
                    contentStyle={{ borderRadius: 8 }}
                  />
                  <Bar dataKey="valor" radius={[6, 6, 0, 0]}>
                    {areas.map((a) => (
                      <Cell key={a.nombre} fill={tonoLogro(a.valor).hex} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Promedio de logro (%) según los filtros aplicados. Promedio de edad:{" "}
              {kpis.total && kpis.edad ? `${kpis.edad} años` : "sin datos"}.
            </p>
          </CardContent>
        </Card>
      </section>

      <section
        aria-label="Filtros"
        className="grid gap-4 rounded-xl border border-border bg-card p-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <div className="space-y-2">
          <Label className="text-base">Rango de edad</Label>
          <Select value={rango} onValueChange={(v) => setRango(v as RangoEdad)}>
            <SelectTrigger className="h-11 text-base">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className={CLASE_SELECT_CONTENT}>
              <SelectItem className={CLASE_SELECT_ITEM} value="todas">Todas</SelectItem>
              <SelectItem className={CLASE_SELECT_ITEM} value="60-69">60-69 años</SelectItem>
              <SelectItem className={CLASE_SELECT_ITEM} value="70-79">70-79 años</SelectItem>
              <SelectItem className={CLASE_SELECT_ITEM} value="80+">80+ años</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-base">Sexo</Label>
          <Select value={sexo} onValueChange={setSexo}>
            <SelectTrigger className="h-11 text-base">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className={CLASE_SELECT_CONTENT}>
              <SelectItem className={CLASE_SELECT_ITEM} value="todos">Todos</SelectItem>
              <SelectItem className={CLASE_SELECT_ITEM} value="Masculino">Masculino</SelectItem>
              <SelectItem className={CLASE_SELECT_ITEM} value="Femenino">Femenino</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-base">Comuna</Label>
          <Select value={comuna} onValueChange={setComuna}>
            <SelectTrigger className="h-11 text-base">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className={CLASE_SELECT_CONTENT}>
              <SelectItem className={CLASE_SELECT_ITEM} value="todas">Todas las comunas</SelectItem>
              {comunas.map((c) => (
                <SelectItem className={CLASE_SELECT_ITEM} key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-end">
          <Button variant="secondary" className="h-11 w-full text-base" onClick={limpiar}>
            Limpiar filtros
          </Button>
        </div>
      </section>

      <section aria-label="Rendimiento por usuario" className="rounded-xl border border-border">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuario / ID</TableHead>
                <TableHead>Edad</TableHead>
                <TableHead>Sexo</TableHead>
                <TableHead>Comuna</TableHead>
                <TableHead>Atención</TableHead>
                <TableHead>Memoria</TableHead>
                <TableHead>F. ejecutivas</TableHead>
                <TableHead>Lenguaje</TableHead>
                <TableHead>Última actividad</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtrados.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">
                    {r.usuario}
                    <span className="block text-sm text-muted-foreground">{r.id}</span>
                  </TableCell>
                  <TableCell>{r.edad ?? "—"}</TableCell>
                  <TableCell>{r.sexo ?? "—"}</TableCell>
                  <TableCell>{r.comuna ?? "—"}</TableCell>
                  <TableCell>
                    <Puntaje valor={r.atencion} />
                  </TableCell>
                  <TableCell>
                    <Puntaje valor={r.memoria} />
                  </TableCell>
                  <TableCell>
                    <Puntaje valor={r.funciones} />
                  </TableCell>
                  <TableCell>
                    <Puntaje valor={r.lenguaje} />
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {r.ultimaActividad ? fechaCorta(r.ultimaActividad) : "—"}
                  </TableCell>
                </TableRow>
              ))}
              {filtrados.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="py-10 text-center text-base text-muted-foreground">
                    No hay usuarios que cumplan con los filtros seleccionados.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </div>
      </section>
    </main>
  );
}

function Kpi({ titulo, valor, detalle }: { titulo: string; valor: string; detalle: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium text-muted-foreground">{titulo}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold tracking-tight">{valor}</p>
        <p className="mt-1 text-sm text-muted-foreground">{detalle}</p>
      </CardContent>
    </Card>
  );
}
