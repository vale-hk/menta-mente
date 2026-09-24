// Logo corporativo de Menta: hoja de menta vertical con el nombre y el eslogan dentro de la hoja.
export const LOGO_ANCHO = 760;
export const LOGO_ALTO = 360;

export const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 360" width="1520" height="720">
<path d="M36 180 L6 198" stroke="#047857" stroke-width="10" stroke-linecap="round"/>
<path d="M36 180 C 170 16, 590 16, 730 180 C 590 344, 170 344, 36 180 Z" fill="#ecfdf5" stroke="#059669" stroke-width="10"/>
<g stroke="#6ee7b7" stroke-width="4.5" stroke-linecap="round" fill="none">
<path d="M66 180 H170"/><path d="M596 180 H700"/>
<path d="M118 180 Q 134 138 162 106"/><path d="M118 180 Q 134 222 162 254"/>
<path d="M648 180 Q 632 138 604 106"/><path d="M648 180 Q 632 222 604 254"/>
</g>
<text x="383" y="192" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="104" font-weight="700" fill="#047857">Menta</text>
<text x="383" y="252" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="32" font-weight="700" fill="#065f46">Mentaliza, Memoriza &amp; Mejora.</text>
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
