import { createContext, useContext, type ReactNode } from "react";
import type { Ejercicio } from "@/data/ejercicios";

type Registrar = (ejercicio: Ejercicio, puntaje: number) => void;

const RegistroContext = createContext<Registrar | null>(null);

export function RegistroProvider({
  registrar,
  children,
}: {
  registrar: Registrar;
  children: ReactNode;
}) {
  return <RegistroContext.Provider value={registrar}>{children}</RegistroContext.Provider>;
}

/** Devuelve una función que guarda el puntaje (0 a 10) del ejercicio actual, si hay sesión activa. */
export function useRegistroEjercicio(ejercicio: Ejercicio) {
  const registrar = useContext(RegistroContext);
  return (puntaje: number) => {
    if (!registrar) return;
    registrar(ejercicio, Math.max(0, Math.min(10, Math.round(puntaje))));
  };
}
