const ITEMS = [
  { color: "bg-red-600", rango: "0–45%", texto: "Oportunidad para seguir ejercitando" },
  { color: "bg-yellow-500", rango: "46–75%", texto: "Rendimiento regular, ¡vas por buen camino!" },
  { color: "bg-emerald-400", rango: "76–89%", texto: "Buen trabajo, rendimiento muy positivo" },
  { color: "bg-green-800", rango: "90–100%", texto: "¡Excelente rendimiento cognitivo!" },
];

export function LeyendaLogro({ className = "" }: { className?: string }) {
  return (
    <ul aria-label="Leyenda de colores de rendimiento" className={`grid gap-3 sm:grid-cols-2 ${className}`}>
      {ITEMS.map((i) => (
        <li key={i.rango} className="flex items-center gap-3">
          <span aria-hidden="true" className={`size-6 shrink-0 rounded border-2 border-foreground/20 ${i.color}`} />
          <span className="text-base">
            <strong>{i.rango}:</strong> {i.texto}
          </span>
        </li>
      ))}
    </ul>
  );
}
