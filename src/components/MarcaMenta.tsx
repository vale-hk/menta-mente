import { MintLeaf } from "@/components/MintLeaf";

export function MarcaMenta({ subtitulo }: { subtitulo?: string }) {
  return (
    <span className="inline-flex max-w-full items-center gap-3 rounded-full border-2 border-brand-foreground/60 bg-brand-foreground/10 px-4 py-2">
      <MintLeaf className="size-12 shrink-0 text-brand-foreground sm:size-14" />
      <span className="min-w-0">
        <span className="block font-serif text-4xl font-semibold text-brand-foreground">
          Menta
        </span>
        {subtitulo && (
          <span className="hidden text-sm text-brand-foreground/85 sm:block">{subtitulo}</span>
        )}
      </span>
    </span>
  );
}
