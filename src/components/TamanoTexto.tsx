import { useEffect, useState } from "react";

const CLAVE = "menta-escala-texto";
const MIN = -2;
const MAX = 5;

/** Controles globales "+" / "−" de tamaño de texto. `base` es el % del tamaño raíz por defecto. */
export function TamanoTexto({ base }: { base: number }) {
  const [paso, setPaso] = useState(0);

  useEffect(() => {
    const g = Number(localStorage.getItem(CLAVE));
    if (Number.isFinite(g)) setPaso(Math.max(MIN, Math.min(MAX, g)));
  }, []);

  useEffect(() => {
    document.documentElement.style.fontSize = `${base * (1 + paso * 0.1)}%`;
    localStorage.setItem(CLAVE, String(paso));
  }, [paso, base]);

  useEffect(() => () => { document.documentElement.style.fontSize = ""; }, []);

  const clase =
    "flex size-12 items-center justify-center rounded-lg border-2 border-brand-foreground bg-brand-foreground/10 text-2xl font-bold text-brand-foreground disabled:opacity-40";

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex items-center gap-2" role="group" aria-label="Tamaño del texto">
        <button type="button" className={clase} onClick={() => setPaso((p) => Math.max(MIN, p - 1))} disabled={paso <= MIN} aria-label="Achicar texto">−</button>
        <button type="button" className={clase} onClick={() => setPaso((p) => Math.min(MAX, p + 1))} disabled={paso >= MAX} aria-label="Agrandar texto">+</button>
      </div>
      <span className="text-center text-xs leading-tight text-brand-foreground/90">Tamaño del texto</span>
    </div>
  );
}
