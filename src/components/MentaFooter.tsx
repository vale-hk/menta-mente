import { Link } from "@tanstack/react-router";
import { descargarLogoJpg } from "@/lib/logoMenta";

export function MentaFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t-4 border-brand bg-brand text-brand-foreground">
      <div className="mx-auto grid max-w-5xl gap-4 px-5 py-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
        <div className="min-w-0">
          <p className="text-sm font-semibold">© {year} Menta. Todos los derechos reservados.</p>
          <p className="mt-1 text-sm text-brand-foreground/90">
            Material de apoyo fonoaudiológico. No reemplaza la evaluación clínica profesional.
          </p>
        </div>
        <nav aria-label="Información legal" className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
          <Link to="/terminos" className="underline decoration-2 underline-offset-4 hover:opacity-80">
            Términos y Condiciones
          </Link>
          <Link to="/privacidad" className="underline decoration-2 underline-offset-4 hover:opacity-80">
            Políticas de Privacidad
          </Link>
          <button type="button" onClick={() => void descargarLogoJpg()} className="underline decoration-2 underline-offset-4 hover:opacity-80">
            Descargar logo (JPG)
          </button>
        </nav>
      </div>
    </footer>
  );
}