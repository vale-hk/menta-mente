import { MintLeaf } from "@/components/MintLeaf";

export function MarcaMenta({ subtitulo }: { subtitulo?: string }) {
  return (
    <span className="inline-flex max-w-full items-center gap-3 rounded-full border-2 border-white bg-white px-4 py-2 shadow-sm">
      <MintLeaf className="size-12 shrink-0 text-emerald-600 sm:size-14" />
      <span className="min-w-0">
        <span className="block font-serif text-4xl font-semibold text-emerald-700">
          Menta
        </span>
        {subtitulo && (
          <span className="hidden text-sm text-emerald-800 sm:block">{subtitulo}</span>
        )}
      </span>
    </span>
  );
}
