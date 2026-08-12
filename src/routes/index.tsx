import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MintLeaf } from "@/components/MintLeaf";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Menta — Estimulación cognitiva para el adulto mayor" },
      {
        name: "description",
        content:
          "Menta es una herramienta de estimulación cognitiva estructurada para personas mayores: atención, memoria, funciones ejecutivas y lenguaje.",
      },
      { property: "og:title", content: "Menta — Estimulación cognitiva para el adulto mayor" },
      {
        property: "og:description",
        content:
          "Actividades terapéuticas de atención, memoria, funciones ejecutivas y lenguaje, con modo de alto contraste.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const areas = [
  {
    id: "atencion",
    titulo: "Atención",
    resumen: "Sostener y focalizar el foco atencional frente a distractores.",
    actividad: "Rastreo de la letra objetivo",
    consigna:
      "Se presenta una hoja con 60 letras dispuestas en filas. La persona debe marcar con un lápiz todas las letras «M» en un tiempo máximo de 3 minutos, leyendo de izquierda a derecha sin saltar filas. Registre aciertos, omisiones y falsas alarmas.",
    duracion: "10 minutos",
    nivel: "Atención selectiva y sostenida",
  },
  {
    id: "memoria",
    titulo: "Memoria",
    resumen: "Codificación, retención y evocación de información cotidiana.",
    actividad: "Lista de compras del almacén",
    consigna:
      "Lea en voz alta una lista de 8 productos (pan, leche, arroz, té, jabón, manzanas, aceite, huevos). Pida evocación inmediata, converse de otro tema durante 5 minutos y solicite una segunda evocación diferida. Si hay dificultad, entregue claves semánticas («era una fruta»).",
    duracion: "15 minutos",
    nivel: "Memoria episódica verbal",
  },
  {
    id: "funciones-ejecutivas",
    titulo: "Funciones ejecutivas",
    resumen: "Planificación, secuenciación e inhibición de respuestas.",
    actividad: "Planificar la once del domingo",
    consigna:
      "La persona ordena en 6 pasos la preparación de una once para cuatro invitados: presupuesto, lista de compras, orden de preparación y horario de servicio. Luego se introduce un imprevisto («falta el pan») y debe reorganizar el plan en voz alta.",
    duracion: "20 minutos",
    nivel: "Planificación y flexibilidad cognitiva",
  },
  {
    id: "lenguaje",
    titulo: "Lenguaje",
    resumen: "Acceso léxico, denominación y discurso conectado.",
    actividad: "Fluencia semántica y descripción",
    consigna:
      "Durante 60 segundos la persona nombra todos los animales que recuerde. A continuación describe una lámina de una feria libre durante 2 minutos, cuidando frases completas. Registre número de palabras, pausas y circunloquios.",
    duracion: "12 minutos",
    nivel: "Fluencia verbal y discurso",
  },
];

function Index() {
  const [oscuro, setOscuro] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", oscuro);
    return () => document.documentElement.classList.remove("dark");
  }, [oscuro]);

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
            className="min-h-11 rounded-lg border border-border bg-secondary px-5 py-2 text-base font-semibold text-secondary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            {oscuro ? "Modo claro" : "Modo oscuro"}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-5 py-10">
        <section aria-labelledby="intro" className="mb-10">
          <h2 id="intro" className="font-serif text-2xl font-semibold">
            Cuatro áreas de trabajo
          </h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Elija un área para revisar la actividad terapéutica sugerida. Cada propuesta puede
            adaptarse al nivel de desempeño de la persona y realizarse acompañada.
          </p>
          <nav aria-label="Áreas cognitivas" className="mt-5 flex flex-wrap gap-3">
            {areas.map((a) => (
              <a
                key={a.id}
                href={`#${a.id}`}
                className="inline-flex min-h-11 items-center rounded-lg border border-border px-4 py-2 font-semibold transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                {a.titulo}
              </a>
            ))}
          </nav>
        </section>

        <ul className="grid gap-6 sm:grid-cols-2">
          {areas.map((a) => (
            <li key={a.id} id={a.id} className="surface-card scroll-mt-6 p-6">
              <h3 className="font-serif text-2xl font-semibold">{a.titulo}</h3>
              <p className="mt-1 text-muted-foreground">{a.resumen}</p>
              <h4 className="mt-5 text-lg font-semibold">Actividad: {a.actividad}</h4>
              <p className="mt-2">{a.consigna}</p>
              <p className="mt-4 text-sm font-medium text-muted-foreground">
                {a.duracion} · {a.nivel}
              </p>
            </li>
          ))}
        </ul>
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
