import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { IntranetShell } from "@/components/IntranetShell";
import { FormularioPerfil } from "@/components/FormularioPerfil";
import { obtenerPerfil, guardarPerfil } from "@/lib/perfil.functions";

export const Route = createFileRoute("/_authenticated/perfil")({
  head: () => ({
    meta: [
      { title: "Mi perfil — Intranet de Menta" },
      {
        name: "description",
        content:
          "Revise y edite sus datos personales en Menta: nombre y apellido, sexo, edad, teléfono y comuna.",
      },
      { property: "og:title", content: "Mi perfil en Menta" },
      {
        property: "og:description",
        content: "Datos personales guardados de forma privada para acompañar su progreso.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Perfil,
});

function Perfil() {
  const queryClient = useQueryClient();
  const cargarPerfil = useServerFn(obtenerPerfil);
  const guardar = useServerFn(guardarPerfil);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);

  const { data, isLoading } = useQuery({ queryKey: ["perfil"], queryFn: () => cargarPerfil() });

  return (
    <IntranetShell>
      <h1 className="font-serif text-3xl font-semibold">Mi perfil</h1>
      <p className="mt-2 text-muted-foreground">
        Estos datos son privados. Solo usted puede verlos y modificarlos.
      </p>

      {isLoading && <p className="mt-6 text-lg">Cargando sus datos…</p>}

      {data && (
        <div className="surface-card mt-8 p-6">
          {aviso && (
            <p role="status" className="mb-5 rounded-lg border-2 border-primary p-4 text-lg font-semibold text-primary">
              {aviso}
            </p>
          )}
          <FormularioPerfil
            key={`${data.nombre}-${data.comuna}`}
            inicial={{
              nombre: data.nombre,
              telefono: data.telefono,
              sexo: data.sexo,
              edad: data.edad,
              comuna: data.comuna,
            }}
            textoBoton="Guardar cambios"
            guardando={guardando}
            error={error}
            onGuardar={(datos) => {
              setError(null);
              setAviso(null);
              setGuardando(true);
              guardar({ data: datos })
                .then(() => {
                  setAviso("Sus datos quedaron guardados.");
                  return queryClient.invalidateQueries({ queryKey: ["perfil"] });
                })
                .catch((err) =>
                  setError(err instanceof Error ? err.message : "No pudimos guardar sus datos."),
                )
                .finally(() => setGuardando(false));
            }}
          />
        </div>
      )}
    </IntranetShell>
  );
}
