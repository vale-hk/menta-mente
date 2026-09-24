// Logo corporativo de Menta: hoja de menta vertical con nombre y eslogan, fondo blanco.
export const LOGO_ANCHO = 420;
export const LOGO_ALTO = 200;

export const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 200" width="840" height="400">
<rect width="420" height="200" fill="#ffffff"/>
<path d="M62 178 L62 196" stroke="#047857" stroke-width="7" stroke-linecap="round"/>
<path d="M62 176 C 14 128, 14 52, 62 8 C 110 52, 110 128, 62 176 Z" fill="#ecfdf5" stroke="#059669" stroke-width="6"/>
<g stroke="#6ee7b7" stroke-width="2.5" stroke-linecap="round" fill="none">
<path d="M62 162 V 26"/>
<path d="M62 130 Q 44 122 34 104"/><path d="M62 130 Q 80 122 90 104"/>
<path d="M62 92 Q 46 84 38 68"/><path d="M62 92 Q 78 84 86 68"/>
</g>
<text x="138" y="112" font-family="Georgia, 'Times New Roman', serif" font-size="76" font-weight="700" fill="#047857">Menta</text>
<text x="140" y="152" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="700" fill="#065f46">Mentaliza, Memoriza &amp; Mejora.</text>
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
