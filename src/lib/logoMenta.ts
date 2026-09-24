// Logo corporativo principal de Menta: hoja, nombre y eslogan dentro de una viñeta blanca.
export const LOGO_ANCHO = 420;
export const LOGO_ALTO = 200;

export const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 200" width="840" height="400">
<rect width="420" height="200" fill="#ffffff"/>
<path d="M22 100 L6 110" stroke="#047857" stroke-width="6" stroke-linecap="round"/>
<path d="M22 100 C 95 8, 325 8, 402 100 C 325 192, 95 192, 22 100 Z" fill="#ecfdf5" stroke="#059669" stroke-width="6"/>
<g stroke="#6ee7b7" stroke-width="2.5" stroke-linecap="round" fill="none">
<path d="M40 100 H108"/><path d="M314 100 H384"/>
<path d="M70 100 Q 80 78 98 62"/><path d="M70 100 Q 80 122 98 138"/>
<path d="M352 100 Q 342 78 324 62"/><path d="M352 100 Q 342 122 324 138"/>
</g>
<text x="211" y="102" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="58" font-weight="700" fill="#047857">Menta</text>
<text x="211" y="134" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="17" font-weight="700" fill="#065f46">Mentaliza, Memoriza &amp; Mejora.</text>
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
