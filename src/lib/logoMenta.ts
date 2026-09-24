// Logo corporativo de Menta: firma fluida cuyo remate se convierte en un tallo con hojas.
export const LOGO_ANCHO = 820;
export const LOGO_ALTO = 220;

export const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 820 220" width="1640" height="440">
<g fill="none" stroke="#047857" stroke-linecap="round" stroke-linejoin="round">
  <path d="M356 94 C420 89 451 79 493 71 C543 62 582 67 620 53 C651 42 674 24 704 19" stroke-width="8"/>
  <path d="M700 21 C674 12 649 20 635 44 C660 49 685 42 700 21 Z" fill="#6ee7b7" stroke-width="5"/>
  <path d="M678 38 C699 35 721 45 732 65 C709 70 687 59 678 38 Z" fill="#a7f3d0" stroke-width="5"/>
  <path d="M638 48 C619 38 597 43 583 61 C601 73 624 67 638 48 Z" fill="#a7f3d0" stroke-width="5"/>
  <path d="M639 44 C659 34 678 27 699 21 M678 38 C695 48 708 56 728 63 M637 49 C619 53 604 58 587 61" stroke-width="3.5"/>
</g>
<text x="22" y="115" font-family="'URW Chancery L','Apple Chancery','Segoe Script','Brush Script MT',cursive" font-size="112" font-style="italic" font-weight="700" fill="#047857">Menta</text>
<text x="31" y="175" font-family="Arial,Helvetica,sans-serif" font-size="29" font-weight="700" letter-spacing="0" fill="#065f46">Mentaliza, Memoriza &amp; Mejora.</text>
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
