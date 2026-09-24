import { MintLeaf } from "@/components/MintLeaf";

export function MarcaMenta({ subtitulo }: { subtitulo?: string }) {
  return (
    <span
      className="inline-flex max-w-full items-center gap-3 rounded-full border-2 border-brand-foreground bg-brand-foreground px-4 py-2 shadow-sm"
    >
      <MintLeaf className="size-12 shrink-0 text-primary sm:size-14" />
      <span className="min-w-0">
        <span className="block font-serif text-4xl font-semibold text-primary">Menta</span>
        <span className="block text-sm font-semibold text-primary" title={subtitulo}>
          Mentaliza, Memoriza &amp; Mejora.
        </span>
      </span>
    </span>
  );
}
