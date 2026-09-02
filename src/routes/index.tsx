import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useTema } from "@/hooks/useTema";
import { MintLeaf } from "@/components/MintLeaf";
import { categorias } from "@/data/ejercicios";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Menta — Ejercicios cognitivos interactivos para adultos mayores" },
      {
        name: "description",
        content:
          "Menta ofrece ejercicios interactivos de atención, memoria, funciones ejecutivas y lenguaje para adultos mayores, con modo oscuro de alto contraste.",
      },
      { property: "og:title", content: "Menta — Ejercicios cognitivos interactivos" },
      {
        property: "og:description",
        content:
          "Actividades resolubles en pantalla: atención, memoria, funciones ejecutivas y lenguaje, con accesibilidad para el adulto mayor.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const { oscuro, alternar } = useTema();
  const [sesion, setSesion] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSesion(Boolean(data.session)));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSesion(Boolean(s)));
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-dvh">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-4 px-5 py-6">
          <div className="flex items-center gap-3">
            <MintLeaf className="size-10 text-primary" />
            <div>
              <h1 className="font-serif text-3xl font-semibold tracking-tight">Menta</h1>
              <p className="text-sm text-muted-foreground">Estimulación cognitiva estructurada</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to={sesion ? "/ejercicios" : "/auth"}
              className="min-h-12 rounded-lg border-2 border-border px-5 py-2 text-base font-semibold leading-8 transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {sesion ? "Ir a mis ejercicios" : "Ingresar"}
            </Link>
            <button
              type="button"
              onClick={alternar}
              aria-pressed={oscuro}
              className="min-h-12 rounded-lg border-2 border-border bg-secondary px-5 py-2 text-base font-semibold text-secondary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {oscuro ? "Modo claro" : "Modo oscuro"}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-5 py-10">
        <section aria-labelledby="intro">
          <h2 id="intro" className="font-serif text-3xl font-semibold">
            Ejercite su mente con actividades guiadas
          </h2>
          <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
            Menta reúne actividades interactivas de estimulación cognitiva pensadas para el adulto
            mayor. Los ejercicios se realizan dentro de su espacio privado y cada puntaje queda
            guardado para seguir su avance.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to={sesion ? "/ejercicios" : "/auth"}
              className="min-h-14 rounded-lg bg-primary px-6 py-3 text-lg font-semibold leading-8 text-primary-foreground transition-opacity hover:opacity-90"
            >
              {sesion ? "Continuar con mis ejercicios" : "Ingresar para comenzar"}
            </Link>
            {sesion && (
              <Link
                to="/progreso"
                className="min-h-14 rounded-lg border-2 border-border px-6 py-3 text-lg font-semibold leading-8"
              >
                Ver mi progreso
              </Link>
            )}
          </div>
          {!sesion && (
            <p className="mt-4 text-lg">
              Para realizar los ejercicios necesita iniciar sesión con su nombre y su teléfono.
            </p>
          )}
        </section>

        <section aria-labelledby="areas" className="mt-12">
          <h2 id="areas" className="font-serif text-2xl font-semibold">
            Las cuatro áreas de trabajo
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {categorias.map((c) => (
              <article key={c.id} className="surface-card p-6">
                <h3 className="font-serif text-xl font-semibold">{c.titulo}</h3>
                <p className="mt-2 text-muted-foreground">{c.resumen}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3 px-5 py-6">
          <p className="text-sm text-muted-foreground">
            Menta · Material de apoyo fonoaudiológico. No reemplaza la evaluación clínica
            profesional.
          </p>
          <Link
            to="/admin"
            className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-accent"
          >
            Acceso administración
          </Link>
        </div>
      </footer>

    </div>
  );
}
