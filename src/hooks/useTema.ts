import { useEffect, useState } from "react";

const CLAVE = "menta-tema";

export function useTema() {
  const [oscuro, setOscuro] = useState(false);

  useEffect(() => {
    const guardado = localStorage.getItem(CLAVE);
    if (guardado === "oscuro") setOscuro(true);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", oscuro);
    localStorage.setItem(CLAVE, oscuro ? "oscuro" : "claro");
  }, [oscuro]);

  return { oscuro, alternar: () => setOscuro((v) => !v) };
}
