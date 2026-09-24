// Logo corporativo de Menta: hoja de menta vertical con el nombre y el eslogan dentro de la hoja.
export const LOGO_ANCHO = 380;
export const LOGO_ALTO = 470;

export const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 470" width="760" height="940">
<path d="M190 428 L190 462" stroke="#047857" stroke-width="9" stroke-linecap="round"/>
<path d="M190 424 C 26 300, 26 130, 190 8 C 354 130, 354 300, 190 424 Z" fill="#ecfdf5" stroke="#059669" stroke-width="8"/>
<g stroke="#6ee7b7" stroke-width="3" stroke-linecap="round" fill="none">
<path d="M190 400 V 40"/>
<path d="M190 340 Q 140 322 110 278"/><path d="M190 340 Q 240 322 270 278"/>
<path d="M190 150 Q 150 136 126 100"/><path d="M190 150 Q 230 136 254 100"/>
</g>
<text x="190" y="225" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="62" font-weight="700" fill="#047857">Menta</text>
<text x="190" y="262" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="21" font-weight="700" fill="#065f46">Mentaliza, Memoriza</text>
<text x="190" y="290" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="21" font-weight="700" fill="#065f46">&amp; Mejora.</text>
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
