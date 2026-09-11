import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { IconoCategoria } from "@/components/IconoCategoria";
import { RegistroProvider } from "@/components/RegistroProgreso";
import { registrarActividad } from "@/lib/progreso.functions";
import { IntranetShell } from "@/components/IntranetShell";
import { EjercicioInteractivo } from "@/components/EjercicioInteractivo";
import { categorias, ejercicios, type Categoria } from "@/data/ejercicios";


export const Route = createFileRoute("/_authenticated/ejercicios")({
  head: () => ({
    meta: [
      { title: "Ejercicios cognitivos — Intranet de Menta" },
      {
        name: "description",
        content:
          "Realice ejercicios interactivos de atención, memoria, funciones ejecutivas y lenguaje. Cada puntaje queda guardado en su progreso personal.",
      },
      { property: "og:title", content: "Ejercicios cognitivos en Menta" },
      {
        property: "og:description",
        content: "Actividades interactivas con registro automático de puntajes.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Ejercicios,
});

function Ejercicios() {
  const queryClient = useQueryClient();
  const [categoria, setCategoria] = useState<Categoria>("atencion");
  const [aviso, setAviso] = useState<string | null>(null);
  const guardar = useServerFn(registrarActividad);

  const registrar = useCallback(
    (ejercicio: (typeof ejercicios)[number], puntaje: number) => {
      guardar({
        data: {
          categoria: ejercicio.categoria,
          nombre_ejercicio: ejercicio.titulo,
          ejercicio_id: ejercicio.id,
          puntaje,
        },
      })
        .then(() => {
          setAviso(`Guardamos su resultado: ${puntaje} de 10 puntos.`);
          toast.success("¡Excelente esfuerzo, siga fortaleciendo su mente!", { duration: 5000 });
          queryClient.invalidateQueries({ queryKey: ["progreso"] });
        })
        .catch(() => setAviso("No pudimos guardar su avance. Intente más tarde."));
    },
    [guardar, queryClient],
  );

  const actual = categorias.find((c) => c.id === categoria)!;
  const lista = ejercicios.filter((e) => e.categoria === categoria);

  return (
    <IntranetShell>
      <h1 className="font-serif text-3xl font-semibold text-primary">Elija un área de trabajo</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Cada actividad se resuelve directamente en la pantalla y su puntaje se guarda
        automáticamente en su progreso.
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

      {aviso && (
        <p
          role="status"
          className="mt-6 rounded-lg border-2 border-primary p-4 text-lg font-semibold text-primary"
        >
          {aviso}
        </p>
      )}

      <section aria-live="polite" className="mt-8">
        <h2 className="flex items-center gap-3 font-serif text-2xl font-semibold text-primary">
          <IconoCategoria categoria={actual.id} />
          {actual.titulo}
        </h2>
        <p className="mt-1 text-muted-foreground">{actual.resumen}</p>
        <div className="mt-6 grid gap-6">
          <RegistroProvider registrar={registrar}>
            {lista.map((e) => (
              <EjercicioInteractivo key={e.id} ejercicio={e} />
            ))}
          </RegistroProvider>
        </div>
      </section>
    </IntranetShell>
  );
}

