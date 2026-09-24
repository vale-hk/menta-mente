import { useState, type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { MarcaMenta } from "@/components/MarcaMenta";
import { useTema } from "@/hooks/useTema";
import { supabase } from "@/integrations/supabase/client";
import { obtenerPerfil, guardarPerfil } from "@/lib/perfil.functions";
import { obtenerProgreso } from "@/lib/progreso.functions";
import { FormularioPerfil } from "@/components/FormularioPerfil";
import { categorias } from "@/data/ejercicios";
import { MentaFooter } from "@/components/MentaFooter";
import { UserRound, Brain, ChartNoAxesColumnIncreasing } from "lucide-react";

const enlaces = [
  { to: "/perfil", texto: "Mi perfil", Icono: UserRound },
  { to: "/ejercicios", texto: "Ejercicios", Icono: Brain },
  { to: "/progreso", texto: "Mi progreso", Icono: ChartNoAxesColumnIncreasing },
] as const;

function primerNombre(nombre: string) {
  return nombre.trim().split(/\s+/)[0] ?? "";
}

export function IntranetShell({ children }: { children: ReactNode }) {
  const { oscuro, alternar } = useTema();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const cargarPerfil = useServerFn(obtenerPerfil);
  const cargarProgreso = useServerFn(obtenerProgreso);
  const guardar = useServerFn(guardarPerfil);

  const [cerrado, setCerrado] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: perfil } = useQuery({ queryKey: ["perfil"], queryFn: () => cargarPerfil() });
  const { data: progreso } = useQuery({ queryKey: ["progreso"], queryFn: () => cargarProgreso() });

  const registros = progreso?.registros ?? [];
  let sugerencia: string | null = null;
  if (registros.length > 0) {
    const promedios = categorias
      .map((c) => {
        const propios = registros.filter((r) => r.categoria === c.id);
        return propios.length
          ? { titulo: c.titulo, prom: propios.reduce((s, r) => s + r.puntaje, 0) / propios.length }
          : null;
      })
      .filter((x): x is { titulo: string; prom: number } => x !== null);
    if (promedios.length > 0) {
      const menor = promedios.reduce((a, b) => (b.prom < a.prom ? b : a));
      sugerencia = menor.titulo;
    }
  }

  async function salir() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  const mostrarOnboarding = perfil !== undefined && !perfil.completo;

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-40 border-b-4 border-brand bg-brand">
        <div className="mx-auto grid max-w-5xl items-center gap-4 px-5 py-4 sm:grid-cols-[minmax(0,1fr)_auto]">
          <Link to="/" aria-label="Menta, volver al menú principal">
            <MarcaMenta subtitulo="Volver al inicio" />
          </Link>
          <div className="flex flex-wrap items-center gap-3 sm:justify-end">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={alternar}
                aria-pressed={oscuro}
                className="min-h-12 rounded-lg border-2 border-brand-foreground bg-brand-foreground/10 px-5 py-2 text-base font-semibold text-brand-foreground"
              >
                {oscuro ? "Modo claro" : "Modo oscuro"}
              </button>
               <span className="hidden max-w-28 text-xs leading-snug text-brand-foreground/90 sm:block">
                Modo oscuro para baja visión
              </span>
            </div>
            <button
              type="button"
              onClick={salir}
              className="min-h-12 rounded-lg border-2 border-brand-foreground px-5 py-2 text-base font-semibold text-brand-foreground"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <nav aria-label="Secciones de la intranet" className="border-b-2 border-border bg-card">
        <div className="mx-auto grid max-w-5xl grid-cols-3 gap-2 px-3 py-3 sm:gap-4 sm:px-5">
          {enlaces.map((e) => (
            <Link
              key={e.to}
              to={e.to}
              activeProps={{ className: "bg-primary text-primary-foreground" }}
              className="flex min-h-14 items-center justify-center gap-2 rounded-lg border-2 border-border px-2 py-3 text-center text-base font-semibold transition-colors hover:bg-accent hover:text-accent-foreground sm:text-lg"
            >
              <e.Icono className="size-6 shrink-0" aria-hidden="true" />
              {e.texto}
            </Link>
          ))}
        </div>
      </nav>

      <div className="mx-auto max-w-5xl px-5 py-8">
        <div className="min-w-0">
          {perfil?.completo && !cerrado && (
            <div
              role="status"
              className="mb-8 rounded-lg border-4 border-primary bg-card p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-serif text-2xl font-semibold">
                    ¡Bienvenido/a, {primerNombre(perfil.nombre)}!
                  </p>
                  <p className="mt-2 text-lg">
                    {sugerencia
                      ? `Hoy le sugerimos practicar un poco más de: ${sugerencia}.`
                      : "Comience con el área que prefiera: cada resultado quedará guardado en su progreso."}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setCerrado(true)}
                  className="min-h-12 rounded-lg border-2 border-border px-5 py-2 text-base font-semibold"
                >
                  Cerrar aviso
                </button>
              </div>
            </div>
          )}

          {children}
        </div>
      </div>
      <MentaFooter />

      {mostrarOnboarding && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-background/95 p-5">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="onboarding"
            className="mx-auto my-6 max-w-lg rounded-lg border-4 border-primary bg-card p-6"
          >
            <h2 id="onboarding" className="font-serif text-3xl font-semibold">
              Cuéntenos sobre usted
            </h2>
            <p className="mt-2 text-lg text-muted-foreground">
              Complete estos datos una sola vez para personalizar sus ejercicios. Después podrá
              editarlos en “Mi perfil”.
            </p>
            <div className="mt-6">
              <FormularioPerfil
                inicial={{
                  nombre: perfil?.nombre ?? "",
                  telefono: perfil?.telefono ?? "",
                  sexo: perfil?.sexo ?? "",
                  edad: perfil?.edad ?? null,
                  comuna: perfil?.comuna ?? "",
                }}
                textoBoton="Guardar y comenzar"
                guardando={guardando}
                error={error}
                onGuardar={(datos) => {
                  setError(null);
                  setGuardando(true);
                  guardar({ data: datos })
                    .then(() => queryClient.invalidateQueries({ queryKey: ["perfil"] }))
                    .catch((err) =>
                      setError(err instanceof Error ? err.message : "No pudimos guardar sus datos."),
                    )
                    .finally(() => setGuardando(false));
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
