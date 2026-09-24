// Logo corporativo de Menta: hoja de menta vertical con el nombre y el eslogan dentro de la hoja.
export const LOGO_ANCHO = 460;
export const LOGO_ALTO = 220;

export const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 220" width="920" height="440">
<path d="M24 110 L4 122" stroke="#047857" stroke-width="7" stroke-linecap="round"/>
<path d="M24 110 C 104 10, 356 10, 440 110 C 356 210, 104 210, 24 110 Z" fill="#ecfdf5" stroke="#059669" stroke-width="7"/>
<g stroke="#6ee7b7" stroke-width="3" stroke-linecap="round" fill="none">
<path d="M44 110 H120"/><path d="M344 110 H420"/>
<path d="M78 110 Q 90 84 110 64"/><path d="M78 110 Q 90 136 110 156"/>
<path d="M386 110 Q 374 84 354 64"/><path d="M386 110 Q 374 136 354 156"/>
</g>
<text x="232" y="112" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="58" font-weight="700" fill="#047857">Menta</text>
<text x="232" y="146" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="17" font-weight="700" fill="#065f46">Mentaliza, Memoriza &amp; Mejora.</text>
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
