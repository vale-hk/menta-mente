const encoder = new TextEncoder();

function bytesAHex(buf: ArrayBuffer) {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function igualSeguro(a: string, b: string) {
  if (a.length !== b.length) return false;
  let dif = 0;
  for (let i = 0; i < a.length; i++) dif |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return dif === 0;
}

async function firmar(expira: number, clave: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(clave),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
  return bytesAHex(await crypto.subtle.sign("HMAC", key, encoder.encode(String(expira))));
}

/** Verifica un token temporal de administración (firma HMAC + vigencia). */
export async function validarTokenAdminServidor(token: string) {
  const clave = process.env["MENTA_ADMIN_CODE"];
  if (!clave) return false;
  const [expiraTexto, firma] = token.split(".");
  const expira = Number(expiraTexto);
  if (!expira || !firma || Number.isNaN(expira) || expira < Date.now()) return false;
  return igualSeguro(firma, await firmar(expira, clave));
}
