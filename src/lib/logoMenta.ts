// Logo corporativo de Menta: hoja de menta vertical con el nombre y el eslogan dentro de la hoja.
export const LOGO_ANCHO = 760;
export const LOGO_ALTO = 360;

export const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 360" width="1520" height="720">
<g transform="rotate(-14 380 180)">
<path d="M40 180 L-30 214" stroke="#047857" stroke-width="14" stroke-linecap="round"/>
<path d="M40 180 C 170 20, 590 20, 726 180 C 590 340, 170 340, 40 180 Z" fill="#ecfdf5" stroke="#059669" stroke-width="10"/>
<g stroke="#6ee7b7" stroke-width="4.5" stroke-linecap="round" fill="none">
<path d="M70 180 H696"/>
<path d="M120 180 Q 136 138 164 106"/><path d="M120 180 Q 136 222 164 254"/>
<path d="M646 180 Q 630 138 602 106"/><path d="M646 180 Q 630 222 602 254"/>
</g>
</g>
<text x="383" y="192" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="104" font-weight="700" fill="#047857">Menta</text>
<text x="383" y="252" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="32" font-weight="700" fill="#065f46" transform="rotate(-14 383 252)">Mentaliza, Memoriza &amp; Mejora.</text>
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
