import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { MintLeaf } from "@/components/MintLeaf";
import { useTema } from "@/hooks/useTema";
import { supabase } from "@/integrations/supabase/client";
import { ingresar } from "@/lib/auth.functions";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Ingresar a Menta — Acceso con nombre y PIN" },
      {
        name: "description",
        content:
          "Ingrese a Menta con su nombre, su número de teléfono y el PIN de acceso para realizar los ejercicios y guardar su progreso cognitivo.",
      },
      { property: "og:title", content: "Ingresar a Menta" },
      {
        property: "og:description",
        content: "Acceso simple con nombre, teléfono y PIN para usar los ejercicios de Menta.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Auth,
});

const campo =
  "min-h-14 w-full rounded-lg border-2 border-border bg-card px-4 text-lg text-foreground";
const accion =
  "min-h-14 w-full rounded-lg bg-primary px-5 text-lg font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50";

function Auth() {
  const { oscuro, alternar } = useTema();
  const navigate = useNavigate();
  const entrar = useServerFn(ingresar);

  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setCargando(true);
    try {
      const r = await entrar({ data: { nombre, telefono, pin } });
      const { error: errSesion } = await supabase.auth.signInWithPassword({
        email: r.email,
        password: r.password,
      });
      if (errSesion) throw new Error("No se pudo iniciar la sesión.");
      navigate({ to: "/ejercicios" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo ingresar.");
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="min-h-dvh">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-4 px-5 py-6">
          <Link to="/" className="flex items-center gap-3">
            <MintLeaf className="size-10 text-primary" />
            <span className="font-serif text-3xl font-semibold tracking-tight">Menta</span>
          </Link>
          <button
            type="button"
            onClick={alternar}
            aria-pressed={oscuro}
            className="min-h-12 rounded-lg border-2 border-border bg-secondary px-5 py-2 text-base font-semibold text-secondary-foreground"
          >
            {oscuro ? "Modo claro" : "Modo oscuro"}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-md px-5 py-10">
        <h1 className="font-serif text-3xl font-semibold">Ingrese a su espacio personal</h1>
        <p className="mt-2 text-muted-foreground">
          Escriba su nombre, su teléfono y el PIN de acceso que le entregó su profesional. La
          sesión queda abierta y sus ejercicios se guardan automáticamente.
        </p>

        <form onSubmit={enviar} className="mt-8 grid gap-5">
          <label className="grid gap-2">
            <span className="text-lg font-semibold">Nombre completo</span>
            <input
              className={campo}
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              maxLength={80}
              autoComplete="name"
              required
            />
          </label>
          <label className="grid gap-2">
            <span className="text-lg font-semibold">Número de teléfono</span>
            <input
              className={campo}
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              inputMode="tel"
              maxLength={20}
              placeholder="+56 9 1234 5678"
              autoComplete="tel"
              required
            />
          </label>
          <label className="grid gap-2">
            <span className="text-lg font-semibold">PIN de acceso (4 dígitos)</span>
            <input
              className={`${campo} text-center text-2xl tracking-[0.5em]`}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, "").slice(0, 4))}
              inputMode="numeric"
              autoComplete="one-time-code"
              required
            />
          </label>
          <button type="submit" className={accion} disabled={cargando}>
            {cargando ? "Ingresando…" : "Entrar"}
          </button>
        </form>

        {error && (
          <p
            role="alert"
            className="mt-6 rounded-lg border-2 border-border px-4 py-3 text-lg font-semibold"
          >
            {error}
          </p>
        )}
      </main>
    </div>
  );
}
