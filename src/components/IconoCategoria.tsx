import { Eye, Brain, ListChecks, MessagesSquare } from "lucide-react";
import type { Categoria } from "@/data/ejercicios";

const iconos = {
  atencion: Eye,
  memoria: Brain,
  "funciones-ejecutivas": ListChecks,
  lenguaje: MessagesSquare,
} as const;

export function IconoCategoria({
  categoria,
  className,
}: {
  categoria: Categoria;
  className?: string;
}) {
  const Icono = iconos[categoria];
  return (
    <span
      aria-hidden="true"
      className={`inline-flex size-14 shrink-0 items-center justify-center rounded-full bg-brand text-brand-foreground ${className ?? ""}`}
    >
      <Icono className="size-8" strokeWidth={2.2} />
    </span>
  );
}
