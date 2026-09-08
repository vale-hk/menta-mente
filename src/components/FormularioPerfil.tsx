import { useState } from "react";
import { comunasRM } from "@/data/adminMock";

export type DatosPerfil = {
  nombre: string;
  telefono: string;
  sexo: string;
  edad: number | null;
  comuna: string;
};

const campo =
  "min-h-14 w-full rounded-lg border-2 border-border bg-card px-4 text-lg text-foreground";
const etiqueta = "text-lg font-semibold";

export function FormularioPerfil({
  inicial,
  textoBoton,
  guardando,
  error,
  onGuardar,
}: {
  inicial: DatosPerfil;
  textoBoton: string;
  guardando: boolean;
  error: string | null;
  onGuardar: (datos: {
    nombre: string;
    telefono: string;
    sexo: string;
    edad: number;
    comuna: string;
  }) => void;
}) {
  const [nombre, setNombre] = useState(inicial.nombre);
  const [telefono, setTelefono] = useState(inicial.telefono);
  const [sexo, setSexo] = useState(inicial.sexo || "Femenino");
  const [edad, setEdad] = useState(inicial.edad ? String(inicial.edad) : "");
  const [comuna, setComuna] = useState(inicial.comuna || comunasRM[0]);

  return (
    <form
      className="grid gap-5"
      onSubmit={(e) => {
        e.preventDefault();
        onGuardar({ nombre, telefono, sexo, edad: Number(edad), comuna });
      }}
    >
      <label className="grid gap-2">
        <span className={etiqueta}>Nombre y apellido</span>
        <input
          className={campo}
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          maxLength={80}
          autoComplete="name"
          required
        />
      </label>

      <label className="grid gap-2">
        <span className={etiqueta}>Sexo</span>
        <select className={campo} value={sexo} onChange={(e) => setSexo(e.target.value)}>
          <option value="Femenino">Femenino</option>
          <option value="Masculino">Masculino</option>
          <option value="Prefiero no decirlo">Prefiero no decirlo</option>
        </select>
      </label>

      <label className="grid gap-2">
        <span className={etiqueta}>Edad</span>
        <input
          className={campo}
          value={edad}
          onChange={(e) => setEdad(e.target.value.replace(/[^0-9]/g, "").slice(0, 3))}
          inputMode="numeric"
          placeholder="Por ejemplo: 72"
          required
        />
      </label>

      <label className="grid gap-2">
        <span className={etiqueta}>Número de teléfono</span>
        <input
          className={campo}
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          inputMode="tel"
          maxLength={20}
          placeholder="+56 9 1234 5678"
          autoComplete="tel"
          required
        />
      </label>

      <label className="grid gap-2">
        <span className={etiqueta}>Comuna</span>
        <select className={campo} value={comuna} onChange={(e) => setComuna(e.target.value)}>
          {comunasRM.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
          <option value="Otra comuna">Otra comuna</option>
        </select>
      </label>

      {error && (
        <p role="alert" className="rounded-lg border-2 border-border px-4 py-3 text-lg font-semibold">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={guardando}
        className="min-h-14 w-full rounded-lg bg-primary px-5 text-lg font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {guardando ? "Guardando…" : textoBoton}
      </button>
    </form>
  );
}
