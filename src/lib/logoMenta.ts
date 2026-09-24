// Logo corporativo de Menta: hoja de menta vertical con el nombre y el eslogan dentro de la hoja.
export const LOGO_ANCHO = 320;
export const LOGO_ALTO = 460;

export const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 460" width="640" height="920">
<path d="M160 420 L160 452" stroke="#047857" stroke-width="9" stroke-linecap="round"/>
<path d="M160 416 C 36 300, 36 130, 160 10 C 284 130, 284 300, 160 416 Z" fill="#ecfdf5" stroke="#059669" stroke-width="8"/>
<g stroke="#6ee7b7" stroke-width="3" stroke-linecap="round" fill="none">
<path d="M160 396 V 40"/>
<path d="M160 330 Q 120 314 96 276"/><path d="M160 330 Q 200 314 224 276"/>
<path d="M160 250 Q 124 236 102 202"/><path d="M160 250 Q 196 236 218 202"/>
<path d="M160 170 Q 130 158 112 128"/><path d="M160 170 Q 190 158 208 128"/>
</g>
<text x="160" y="230" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="64" font-weight="700" fill="#047857">Menta</text>
<text x="160" y="266" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="19" font-weight="700" fill="#065f46">Mentaliza, Memoriza</text>
<text x="160" y="292" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="19" font-weight="700" fill="#065f46">&amp; Mejora.</text>
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
