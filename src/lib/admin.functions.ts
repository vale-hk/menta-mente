import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/** Duración del token temporal de administración: 1 hora. */
const DURACION_MS = 60 * 60 * 1000;

const encoder = new TextEncoder();

function bytesAHex(buf: ArrayBuffer) {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function sha256Hex(texto: string) {
  return bytesAHex(await crypto.subtle.digest("SHA-256", encoder.encode(texto)));
}

/** Comparación en tiempo constante (sobre digests de igual largo). */
function igualSeguro(a: string, b: string) {
  if (a.length !== b.length) return false;
  let dif = 0;
  for (let i = 0; i < a.length; i++) dif |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return dif === 0;
}

function leerClave() {
  const clave = process.env["MENTA_ADMIN_CODE"];
  if (!clave) throw new Error("Falta configurar la clave de administración.");
  return clave;
}

async function firmar(expira: number, clave: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(clave),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
  const firma = await crypto.subtle.sign("HMAC", key, encoder.encode(String(expira)));
  return bytesAHex(firma);
}

/** Valida la clave de administración y entrega un token temporal firmado. */
export const iniciarSesionAdmin = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ clave: z.string().min(1, "Ingrese la clave").max(200) }).parse(input),
  )
  .handler(async ({ data }) => {
    const esperada = leerClave();
    const [a, b] = await Promise.all([sha256Hex(data.clave), sha256Hex(esperada)]);
    if (!igualSeguro(a, b)) return { ok: false as const };

    const expira = Date.now() + DURACION_MS;
    const firma = await firmar(expira, esperada);
    return { ok: true as const, token: `${expira}.${firma}`, expira };
  });

/** Verifica que un token de administración siga siendo válido. */
export const validarTokenAdmin = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ token: z.string().max(300) }).parse(input))
  .handler(async ({ data }) => {
    const [expiraTexto, firma] = data.token.split(".");
    const expira = Number(expiraTexto);
    if (!expira || !firma || Number.isNaN(expira) || expira < Date.now()) {
      return { valido: false as const };
    }
    const esperada = await firmar(expira, leerClave());
    return { valido: igualSeguro(firma, esperada) };
  });
