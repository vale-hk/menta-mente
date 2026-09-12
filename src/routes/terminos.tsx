import { createFileRoute, Link } from "@tanstack/react-router";
import { MarcaMenta } from "@/components/MarcaMenta";
import { MentaFooter } from "@/components/MentaFooter";

export const Route = createFileRoute("/terminos")({
  head: () => ({ meta: [
    { title: "Términos y Condiciones — Menta" },
    { name: "description", content: "Condiciones de uso de la plataforma de ejercicios cognitivos Menta." },
    { property: "og:title", content: "Términos y Condiciones — Menta" },
    { property: "og:description", content: "Condiciones de uso de la plataforma Menta." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: Terminos,
});

function Terminos() {
  return <div className="min-h-dvh">
    <header className="bg-brand"><div className="mx-auto max-w-4xl px-5 py-5"><Link to="/"><MarcaMenta subtitulo="Volver al inicio" /></Link></div></header>
    <main className="mx-auto max-w-3xl px-5 py-10">
      <h1 className="font-serif text-3xl font-semibold text-primary">Términos y Condiciones</h1>
      <div className="mt-6 grid gap-5 text-lg">
        <p>Menta ofrece actividades de estimulación cognitiva como material de apoyo y no reemplaza una evaluación, diagnóstico o tratamiento profesional.</p>
        <p>La persona usuaria es responsable de entregar información correcta, resguardar su acceso y utilizar la plataforma de manera personal.</p>
        <p>Los resultados muestran el desempeño en las actividades realizadas y no constituyen una clasificación clínica.</p>
      </div>
    </main>
    <MentaFooter />
  </div>;
}