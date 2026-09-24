import { LOGO_DATA_URI } from "@/lib/logoMenta";

export function MarcaMenta({ subtitulo }: { subtitulo?: string }) {
  return (
    <span
      className="inline-flex max-w-full items-center rounded-2xl border-2 border-brand-foreground bg-brand-foreground px-2 py-1 shadow-sm"
      title={subtitulo}
    >
      <img
        src={LOGO_DATA_URI}
        alt="Menta — Mentaliza, Memoriza & Mejora."
        className="h-16 w-auto max-w-full sm:h-20"
      />
    </span>
  );
}
