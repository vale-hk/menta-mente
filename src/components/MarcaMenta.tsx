import { LOGO_DATA_URI } from "@/lib/logoMenta";

export function MarcaMenta({ subtitulo }: { subtitulo?: string }) {
  return (
    <span className="inline-flex max-w-full items-center" title={subtitulo}>
      <img src={LOGO_DATA_URI} alt="Menta — Mentaliza, Memoriza & Mejora." className="h-32 w-auto sm:h-44" />
    </span>
  );
}
