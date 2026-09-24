// Logo corporativo de Menta: hoja de menta vertical con el nombre y el eslogan dentro de la hoja.
export const LOGO_ANCHO = 460;
export const LOGO_ALTO = 560;

export const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 560" width="920" height="1120">
<path d="M230 512 L230 552" stroke="#047857" stroke-width="11" stroke-linecap="round"/>
<path d="M230 508 C 32 362, 32 152, 230 10 C 428 152, 428 362, 230 508 Z" fill="#ecfdf5" stroke="#059669" stroke-width="10"/>
<g stroke="#6ee7b7" stroke-width="4" stroke-linecap="round" fill="none">
<path d="M230 480 V 48"/>
<path d="M230 410 Q 168 388 132 334"/><path d="M230 410 Q 292 388 328 334"/>
<path d="M230 180 Q 180 162 152 120"/><path d="M230 180 Q 280 162 308 120"/>
</g>
<text x="230" y="272" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="82" font-weight="700" fill="#047857">Menta</text>
<text x="230" y="318" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="27" font-weight="700" fill="#065f46">Mentaliza, Memoriza</text>
<text x="230" y="352" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="27" font-weight="700" fill="#065f46">&amp; Mejora.</text>
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
