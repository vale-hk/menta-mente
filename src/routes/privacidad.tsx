import { createFileRoute, Link } from "@tanstack/react-router";
import { MarcaMenta } from "@/components/MarcaMenta";
import { MentaFooter } from "@/components/MentaFooter";

export const Route = createFileRoute("/privacidad")({
  head: () => ({ meta: [
    { title: "Políticas de Privacidad — Menta" },
    { name: "description", content: "Información sobre el tratamiento y protección de datos personales en Menta." },
    { property: "og:title", content: "Políticas de Privacidad — Menta" },
    { property: "og:description", content: "Protección y tratamiento de datos personales en Menta." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: Privacidad,
});

function Privacidad() {
  return <div className="min-h-dvh">
    <header className="bg-brand"><div className="mx-auto max-w-4xl px-5 py-5"><Link to="/"><MarcaMenta subtitulo="Volver al inicio" /></Link></div></header>
    <main className="mx-auto max-w-3xl px-5 py-10">
      <h1 className="font-serif text-3xl font-semibold text-primary">Políticas de Privacidad</h1>
      <div className="mt-6 grid gap-5 text-lg">
        <p>Menta utiliza sus datos de perfil y resultados únicamente para habilitar su espacio privado, guardar su progreso y generar estadísticas protegidas.</p>
        <p>Cada persona puede consultar solo su propia información. El acceso administrativo se mantiene restringido y los datos están protegidos por controles de acceso.</p>
        <p>No compartimos información personal con terceros para fines publicitarios.</p>
      </div>
    </main>
    <MentaFooter />
  </div>;
}