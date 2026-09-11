import { MintLeaf } from "@/components/MintLeaf";

export function MarcaMenta({ subtitulo }: { subtitulo?: string }) {
  return (
    <span className="flex items-center gap-4">
      <span className="flex size-16 items-center justify-center rounded-full border-4 border-brand-foreground/70 bg-brand-foreground/10">
        <MintLeaf className="size-11 text-brand-foreground" />
      </span>
      <span>
        <span className="block font-serif text-4xl font-semibold tracking-tight text-brand-foreground">
          Menta
        </span>
        {subtitulo && (
          <span className="block text-sm text-brand-foreground/85">{subtitulo}</span>
        )}
      </span>
    </span>
  );
}
