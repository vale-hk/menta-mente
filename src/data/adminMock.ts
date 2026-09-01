export const comunasRM = [
  "Santiago",
  "Maipú",
  "La Florida",
  "Puente Alto",
  "Ñuñoa",
  "Providencia",
  "Las Condes",
  "Peñalolén",
  "La Reina",
  "Recoleta",
  "San Miguel",
  "Quilicura",
] as const;

export type Sexo = "Femenino" | "Masculino";

export type RegistroAdmin = {
  id: string;
  usuario: string;
  edad: number;
  sexo: Sexo;
  comuna: string;
  atencion: number;
  memoria: number;
  funciones: number;
  lenguaje: number;
  ultimaActividad: string; // ISO
};

/** Generador pseudoaleatorio determinista: mismos datos en servidor y navegador. */
function crearRandom(semilla: number) {
  let s = semilla;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

const nombres = [
  "María",
  "José",
  "Rosa",
  "Luis",
  "Carmen",
  "Pedro",
  "Ana",
  "Jorge",
  "Gladys",
  "Hernán",
  "Elena",
  "Raúl",
  "Sonia",
  "Manuel",
  "Teresa",
  "Óscar",
  "Ximena",
  "Sergio",
];
const apellidos = [
  "Pérez",
  "González",
  "Muñoz",
  "Rojas",
  "Díaz",
  "Soto",
  "Contreras",
  "Silva",
  "Fuentes",
  "Vargas",
  "Araya",
  "Espinoza",
];

function generar(): RegistroAdmin[] {
  const rnd = crearRandom(20260901);
  const base = Date.UTC(2026, 7, 31);
  return Array.from({ length: 18 }, (_, i) => {
    const edad = 60 + Math.floor(rnd() * 29);
    const sexo: Sexo = rnd() > 0.42 ? "Femenino" : "Masculino";
    const puntaje = () => 45 + Math.floor(rnd() * 55);
    return {
      id: `MEN-${String(i + 1).padStart(3, "0")}`,
      usuario: `${nombres[Math.floor(rnd() * nombres.length)]} ${apellidos[Math.floor(rnd() * apellidos.length)]}`,
      edad,
      sexo,
      comuna: comunasRM[Math.floor(rnd() * comunasRM.length)],
      atencion: puntaje(),
      memoria: puntaje(),
      funciones: puntaje(),
      lenguaje: puntaje(),
      ultimaActividad: new Date(base - Math.floor(rnd() * 30) * 86400000).toISOString(),
    };
  });
}

export const registrosAdmin: RegistroAdmin[] = generar();
