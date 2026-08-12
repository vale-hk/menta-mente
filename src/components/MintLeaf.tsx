export function MintLeaf({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      aria-hidden="true"
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 40c0-16 10-28 32-32 2 22-10 34-26 34-3 0-6-.7-6-2Z" />
      <path d="M9 39C18 30 27 22 38 10" />
      <path d="M20 30h9M25 22h9" />
    </svg>
  );
}
