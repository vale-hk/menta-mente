/** Insignia de porcentaje con fondo sólido y máximo contraste. */
export function claseInsignia(pct: number) {
  if (pct <= 45) return "bg-red-500 text-gray-900";
  if (pct <= 75) return "bg-yellow-400 text-gray-900";
  if (pct <= 89) return "bg-emerald-400 text-gray-900";
  return "bg-green-800 text-white";
}

export function InsigniaLogro({ pct, children }: { pct: number; children?: React.ReactNode }) {
  return (
    <span className={`inline-block whitespace-nowrap rounded-md px-2.5 py-1 font-extrabold ${claseInsignia(pct)}`}>
      {children ?? `${pct}%`}
    </span>
  );
}
