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
      <header className="border-b-4 border-brand bg-brand">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-4 px-5 py-6">
          <Link to="/" aria-label="Menta, ir al inicio">
            <MarcaMenta subtitulo="Estimulación cognitiva estructurada" />
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to={sesion ? "/ejercicios" : "/auth"}
              className="min-h-12 rounded-lg border-2 border-brand-foreground px-5 py-2 text-base font-semibold leading-8 text-brand-foreground transition-opacity hover:opacity-80"
            >
              {sesion ? "Ir a mis ejercicios" : "Ingresar"}
            </Link>
            <div className="flex flex-col items-start">
              <button
                type="button"
                onClick={alternar}
                aria-pressed={oscuro}
                className="min-h-12 rounded-lg border-2 border-brand-foreground bg-brand-foreground/10 px-5 py-2 text-base font-semibold text-brand-foreground transition-opacity hover:opacity-80"
              >
                {oscuro ? "Modo claro" : "Modo oscuro"}
              </button>
              <span className="mt-1 text-xs text-brand-foreground/85">
                Modo oscuro para baja visión
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-5 py-10">
        <section aria-labelledby="intro">
          <h2 id="intro" className="font-serif text-3xl font-semibold text-primary">
            Ejercite su mente con actividades guiadas
          </h2>
          <p className="mt-3 max-w-2xl text-justify text-lg text-muted-foreground">
            Menta reúne <strong className="font-bold">actividades interactivas</strong> de
            estimulación cognitiva, un trabajo{" "}
            <strong className="font-bold">que ayuda a la mente</strong> de las{" "}
            <strong className="font-bold">personas mayores</strong>. Los ejercicios se realizan
            dentro de su espacio privado y cada puntaje queda guardado para seguir su avance.
          </p>
          {!sesion && (
            <p className="mt-4 text-lg">
              Para realizar los ejercicios necesita iniciar sesión con su nombre y su teléfono.
            </p>
          )}
        </section>

        <section aria-labelledby="areas" className="mt-12">
          <h2 id="areas" className="font-serif text-2xl font-semibold text-primary">
            Las cuatro áreas de trabajo
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {categorias.map((c) => (
              <article
                key={c.id}
                className="surface-card border-4 border-brand p-6"
              >
                <div className="flex items-center gap-4">
                  <IconoCategoria categoria={c.id} />
                  <h3 className="font-serif text-xl font-semibold text-primary">{c.titulo}</h3>
                </div>
                <p className="mt-3 text-muted-foreground">{c.resumen}</p>
              </article>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
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
        </section>
      </main>

      <footer className="border-t-4 border-brand bg-brand">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3 px-5 py-6">
          <p className="text-sm text-brand-foreground">
            Menta · Material de apoyo fonoaudiológico. No reemplaza la evaluación clínica
            profesional.
          </p>
          <Link
            to="/admin"
            className="rounded-md border-2 border-brand-foreground px-4 py-2 text-sm font-medium text-brand-foreground hover:opacity-80"
          >
            Acceso administración
          </Link>
        </div>
      </footer>

    </div>
  );
}
