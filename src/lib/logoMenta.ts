// Logo corporativo publicado de Menta: hoja junto al nombre y eslogan en una viñeta blanca.
export const LOGO_ANCHO = 460;
export const LOGO_ALTO = 128;

export const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 128" width="920" height="256">
<rect x="2" y="2" width="456" height="124" rx="62" fill="#ffffff"/>
<g transform="translate(24 25) scale(1.55)" fill="none" stroke="#059669" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
<path d="M8 40c0-16 10-28 32-32 2 22-10 34-26 34-3 0-6-.7-6-2Z"/>
<path d="M9 39C18 30 27 22 38 10"/>
<path d="M20 30h9M25 22h9"/>
</g>
<text x="130" y="67" font-family="Georgia, 'Times New Roman', serif" font-size="51" font-weight="700" fill="#047857">Menta</text>
<text x="131" y="98" font-family="Arial, Helvetica, sans-serif" font-size="19" font-weight="700" fill="#065f46">Mentaliza, Memoriza &amp; Mejora.</text>
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
