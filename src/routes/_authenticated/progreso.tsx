import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { MintLeaf } from "@/components/MintLeaf";
import { useTema } from "@/hooks/useTema";
import { supabase } from "@/integrations/supabase/client";
import { obtenerProgreso } from "@/lib/progreso.functions";
import { categorias } from "@/data/ejercicios";

export const Route = createFileRoute("/_authenticated/progreso")({
  head: () => ({
    meta: [
      { title: "Mi progreso en Menta — Intranet personal" },
      {
        name: "description",
        content:
          "Revise sus ejercicios realizados por categoría, sus puntajes, la fecha del último intento y su nivel de progreso general en Menta.",
      },
      { property: "og:title", content: "Mi progreso en Menta" },
      {
        property: "og:description",
        content: "Panel privado con puntajes, fechas y nivel de progreso general.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Progreso,
});

type Registro = {
  id: string;
  categoria: string;
  nombre_ejercicio: string;
  ejercicio_id: string | null;
  puntaje: number;
  fecha_ejecucion: string;
};

function fecha(iso: string) {
  return new Date(iso).toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function mensajeAnimo(total: number, ultimaSemana: number, promedio: number) {
  if (total === 0)
    return "Comience cuando quiera: cada ejercicio que realice quedará guardado aquí para acompañar su avance.";
  if (ultimaSemana >= 3)
    return `¡Excelente trabajo! Ha ejercitado su mente ${ultimaSemana} veces esta semana. ¡Siga así!`;
  if (promedio >= 8)
    return "¡Muy buenos resultados! Su precisión es alta. Un ejercicio más y su semana queda redonda.";
  if (ultimaSemana > 0)
    return "¡Buen ritmo! Ya practicó esta semana. Una sesión breve al día hace una gran diferencia.";
  return "Nos alegra verle de vuelta. Retome con un ejercicio corto: lo importante es la constancia.";
}

function Progreso() {
  const { oscuro, alternar } = useTema();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const cargarProgreso = useServerFn(obtenerProgreso);

  const { data, isLoading } = useQuery({
    queryKey: ["progreso"],
    queryFn: () => cargarProgreso(),
  });

  const registros: Registro[] = (data?.registros ?? []) as Registro[];
  const total = registros.length;
  const promedio = total ? registros.reduce((s, r) => s + r.puntaje, 0) / total : 0;
  const hace7 = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const ultimaSemana = registros.filter((r) => new Date(r.fecha_ejecucion).getTime() >= hace7).length;
  const nivel = Math.round((promedio / 10) * 100);

  async function salir() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="min-h-dvh">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-4 px-5 py-6">
          <Link to="/" className="flex items-center gap-3">
            <MintLeaf className="size-10 text-primary" />
            <span className="font-serif text-3xl font-semibold tracking-tight">Menta</span>
          </Link>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/ejercicios"
              className="min-h-12 rounded-lg border-2 border-border px-5 py-2 text-base font-semibold leading-8"
            >
              Ejercicios
            </Link>
            <button
              type="button"
              onClick={alternar}
              aria-pressed={oscuro}
              className="min-h-12 rounded-lg border-2 border-border bg-secondary px-5 py-2 text-base font-semibold text-secondary-foreground"
            >
              {oscuro ? "Modo claro" : "Modo oscuro"}
            </button>
            <button
              type="button"
              onClick={salir}
              className="min-h-12 rounded-lg border-2 border-border px-5 py-2 text-base font-semibold"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-5 py-10">
        <h1 className="font-serif text-3xl font-semibold">
          Hola{data?.nombre ? `, ${data.nombre}` : ""}
        </h1>
        <p className="mt-2 text-muted-foreground">
          Este es su espacio privado. Solo usted puede ver estos registros.
        </p>

        <section className="surface-card mt-8 p-6" aria-labelledby="nivel">
          <h2 id="nivel" className="font-serif text-2xl font-semibold">
            Nivel de progreso general
          </h2>
          <p className="mt-3 text-5xl font-semibold text-primary">{nivel}%</p>
          <div
            className="mt-4 h-4 w-full overflow-hidden rounded-full border-2 border-border"
            role="progressbar"
            aria-valuenow={nivel}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Nivel de progreso general"
          >
            <div className="h-full bg-primary" style={{ width: `${nivel}%` }} />
          </div>
          <p className="mt-4 text-lg">{mensajeAnimo(total, ultimaSemana, promedio)}</p>
          <p className="mt-2 text-muted-foreground">
            {total} {total === 1 ? "ejercicio registrado" : "ejercicios registrados"} · promedio{" "}
            {promedio.toFixed(1)} de 10 puntos
          </p>
        </section>

        {isLoading && <p className="mt-8 text-lg">Cargando su progreso…</p>}

        <div className="mt-8 grid gap-6">
          {categorias.map((c) => {
            const propios = registros.filter((r) => r.categoria === c.id);
            const porEjercicio = new Map<string, Registro>();
            for (const r of propios) {
              if (!porEjercicio.has(r.nombre_ejercicio)) porEjercicio.set(r.nombre_ejercicio, r);
            }
            const prom = propios.length
              ? propios.reduce((s, r) => s + r.puntaje, 0) / propios.length
              : 0;
            return (
              <section key={c.id} className="surface-card p-6" aria-labelledby={`cat-${c.id}`}>
                <h2 id={`cat-${c.id}`} className="font-serif text-2xl font-semibold">
                  {c.titulo}
                </h2>
                <p className="mt-1 text-muted-foreground">
                  {propios.length
                    ? `${propios.length} realizaciones · promedio ${prom.toFixed(1)} de 10`
                    : "Aún no hay ejercicios registrados en esta área."}
                </p>
                {porEjercicio.size > 0 && (
                  <ul className="mt-4 grid gap-3">
                    {[...porEjercicio.values()].map((r) => (
                      <li key={r.id} className="rounded-lg border-2 border-border p-4 text-lg">
                        <span className="font-semibold">{r.nombre_ejercicio}</span> — {r.puntaje} pts
                        <span className="block text-base text-muted-foreground">
                          Última realización: {fecha(r.fecha_ejecucion)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            );
          })}
        </div>
      </main>
    </div>
  );
}
