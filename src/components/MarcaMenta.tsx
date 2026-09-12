import { MintLeaf } from "@/components/MintLeaf";

export function MarcaMenta({ subtitulo }: { subtitulo?: string }) {
  return (
    <span className="flex items-center gap-3 rounded-full border-2 border-brand-foreground/60 bg-brand-foreground/10 px-4 py-2">
      <MintLeaf className="size-14 shrink-0 text-brand-foreground" />
      <span>
        <span className="block font-serif text-4xl font-semibold text-brand-foreground">
          Menta
        </span>
        {subtitulo && (
          <span className="block text-sm text-brand-foreground/85">{subtitulo}</span>
        )}
      </span>
    </span>
  );
}
