import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MintLeaf } from "@/components/MintLeaf";
import { EjercicioInteractivo } from "@/components/EjercicioInteractivo";
import { categorias, ejercicios, type Categoria } from "@/data/ejercicios";

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
  const [oscuro, setOscuro] = useState(false);
  const [categoria, setCategoria] = useState<Categoria>("atencion");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", oscuro);
    return () => document.documentElement.classList.remove("dark");
  }, [oscuro]);

  const actual = categorias.find((c) => c.id === categoria)!;
  const lista = ejercicios.filter((e) => e.categoria === categoria);

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
          <button
            type="button"
            onClick={() => setOscuro((v) => !v)}
            aria-pressed={oscuro}
            className="min-h-12 rounded-lg border-2 border-border bg-secondary px-5 py-2 text-base font-semibold text-secondary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            {oscuro ? "Modo claro" : "Modo oscuro"}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-5 py-10">
        <section aria-labelledby="intro" className="mb-8">
          <h2 id="intro" className="font-serif text-2xl font-semibold">
            Elija un área de trabajo
          </h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Cada actividad se resuelve directamente en la pantalla. Puede comprobar sus respuestas
            y repetir el ejercicio las veces que quiera.
          </p>
          <nav aria-label="Áreas cognitivas" className="mt-5 flex flex-wrap gap-3">
            {categorias.map((c) => (
              <button
                key={c.id}
                type="button"
                aria-current={categoria === c.id ? "page" : undefined}
                onClick={() => setCategoria(c.id)}
                className={`min-h-12 rounded-lg border-2 border-border px-5 py-2 text-base font-semibold transition-colors hover:bg-accent hover:text-accent-foreground ${
                  categoria === c.id ? "bg-primary text-primary-foreground" : ""
                }`}
              >
                {c.titulo}
              </button>
            ))}
          </nav>
        </section>

        <section aria-live="polite">
          <h2 className="font-serif text-2xl font-semibold">{actual.titulo}</h2>
          <p className="mt-1 text-muted-foreground">{actual.resumen}</p>
          <div className="mt-6 grid gap-6">
            {lista.map((e) => (
              <EjercicioInteractivo key={e.id} ejercicio={e} />
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <p className="mx-auto max-w-4xl px-5 py-6 text-sm text-muted-foreground">
          Menta · Material de apoyo fonoaudiológico. No reemplaza la evaluación clínica
          profesional.
        </p>
      </footer>
    </div>
  );
}
