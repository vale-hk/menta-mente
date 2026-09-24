// Logo corporativo de Menta: hoja de menta vertical con el nombre y el eslogan dentro de la hoja.
export const LOGO_ANCHO = 560;
export const LOGO_ALTO = 270;

export const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 270" width="1120" height="540">
<path d="M28 135 L4 149" stroke="#047857" stroke-width="8" stroke-linecap="round"/>
<path d="M28 135 C 126 12, 434 12, 536 135 C 434 258, 126 258, 28 135 Z" fill="#ecfdf5" stroke="#059669" stroke-width="8"/>
<g stroke="#6ee7b7" stroke-width="3.5" stroke-linecap="round" fill="none">
<path d="M52 135 H140"/><path d="M424 135 H512"/>
<path d="M92 135 Q 106 102 130 78"/><path d="M92 135 Q 106 168 130 192"/>
<path d="M472 135 Q 458 102 434 78"/><path d="M472 135 Q 458 168 434 192"/>
</g>
<text x="282" y="140" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="76" font-weight="700" fill="#047857">Menta</text>
<text x="282" y="184" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="23" font-weight="700" fill="#065f46">Mentaliza, Memoriza &amp; Mejora.</text>
</svg>`;

export const LOGO_DATA_URI = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(LOGO_SVG)}`;

/** Rasteriza el logo a PNG/JPG (solo navegador). */
export function logoRaster(formato: "image/png" | "image/jpeg" = "image/png", escala = 4): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = LOGO_ANCHO * escala;
      c.height = LOGO_ALTO * escala;
      const ctx = c.getContext("2d")!;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.drawImage(img, 0, 0, c.width, c.height);
      resolve(c.toDataURL(formato, 0.95));
    };
    img.onerror = reject;
    img.src = LOGO_DATA_URI;
  });
}

export async function descargarLogoJpg() {
  const url = await logoRaster("image/jpeg", 6);
  const a = document.createElement("a");
  a.href = url;
  a.download = "logo-menta.jpg";
  a.click();
}
