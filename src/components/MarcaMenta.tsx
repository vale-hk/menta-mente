export function MarcaMenta({ subtitulo }: { subtitulo?: string }) {
  return (
    <span
      className="inline-flex max-w-full items-center text-brand-foreground"
      title={subtitulo}
      aria-label="Menta — Mentaliza, Memoriza & Mejora."
    >
      <svg
        viewBox="0 0 820 220"
        role="img"
        aria-hidden="true"
        className="h-20 w-auto max-w-full sm:h-24"
      >
        <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
          <path
            d="M356 94 C420 89 451 79 493 71 C543 62 582 67 620 53 C651 42 674 24 704 19"
            strokeWidth="8"
          />
          <path
            d="M700 21 C674 12 649 20 635 44 C660 49 685 42 700 21 Z"
            fill="currentColor"
            fillOpacity="0.72"
            strokeWidth="5"
          />
          <path
            d="M678 38 C699 35 721 45 732 65 C709 70 687 59 678 38 Z"
            fill="currentColor"
            fillOpacity="0.5"
            strokeWidth="5"
          />
          <path
            d="M638 48 C619 38 597 43 583 61 C601 73 624 67 638 48 Z"
            fill="currentColor"
            fillOpacity="0.5"
            strokeWidth="5"
          />
          <path
            d="M639 44 C659 34 678 27 699 21 M678 38 C695 48 708 56 728 63 M637 49 C619 53 604 58 587 61"
            strokeWidth="3.5"
          />
        </g>
        <text
          x="22"
          y="115"
          fill="currentColor"
          fontFamily="'URW Chancery L','Apple Chancery','Segoe Script','Brush Script MT',cursive"
          fontSize="112"
          fontStyle="italic"
          fontWeight="700"
        >
          Menta
        </text>
        <text
          x="31"
          y="175"
          fill="currentColor"
          fontFamily="Arial,Helvetica,sans-serif"
          fontSize="29"
          fontWeight="700"
          letterSpacing="0"
        >
          Mentaliza, Memoriza &amp; Mejora.
        </text>
      </svg>
    </span>
  );
}
