import { useEffect, useMemo, useState } from "react";
import type { Ejercicio } from "@/data/ejercicios";

function normalizar(t: string) {
  return t
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function Feedback({ estado, texto }: { estado: "ok" | "mal" | null; texto?: string | undefined }) {
  if (!estado) return null;
  return (
    <p
      role="status"
      className={`mt-4 rounded-lg border-2 px-4 py-3 text-lg font-semibold ${
        estado === "ok" ? "border-primary text-primary" : "border-border text-foreground"
      }`}
    >
      {texto ?? (estado === "ok" ? "¡Muy bien! Respuesta correcta." : "Aún no. Intente nuevamente.")}
    </p>
  );
}

const botonBase =
  "min-h-12 rounded-lg border-2 border-border px-4 py-2 text-left text-base font-semibold transition-colors hover:bg-accent hover:text-accent-foreground";
const botonAccion =
  "min-h-12 rounded-lg bg-primary px-5 py-2 text-base font-semibold text-primary-foreground transition-opacity hover:opacity-90";

function OpcionMultiple({ ej }: { ej: Extract<Ejercicio, { tipo: "opcion-multiple" }> }) {
  const [sel, setSel] = useState<number | null>(null);
  const [rev, setRev] = useState(false);
  return (
    <div>
      <p className="mt-3 text-lg font-semibold">{ej.enunciado}</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {ej.opciones.map((o, i) => (
          <button
            key={o}
            type="button"
            aria-pressed={sel === i}
            onClick={() => {
              setSel(i);
              setRev(false);
            }}
            className={`${botonBase} ${sel === i ? "bg-secondary text-secondary-foreground" : ""}`}
          >
            {o}
          </button>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <button type="button" className={botonAccion} disabled={sel === null} onClick={() => setRev(true)}>
          Comprobar
        </button>
        <button
          type="button"
          className={botonBase}
          onClick={() => {
            setSel(null);
            setRev(false);
          }}
        >
          Reiniciar
        </button>
      </div>
      <Feedback estado={rev ? (sel === ej.correcta ? "ok" : "mal") : null} />
    </div>
  );
}

function SeleccionMultiple({ ej }: { ej: Extract<Ejercicio, { tipo: "seleccion-multiple" }> }) {
  const [sel, setSel] = useState<number[]>([]);
  const [rev, setRev] = useState(false);
  const correcto =
    sel.length === ej.correctas.length && ej.correctas.every((c) => sel.includes(c));
  return (
    <div>
      <div className="mt-4 flex flex-wrap gap-3">
        {ej.items.map((it, i) => (
          <button
            key={`${it}-${i}`}
            type="button"
            aria-pressed={sel.includes(i)}
            onClick={() => {
              setSel((s) => (s.includes(i) ? s.filter((x) => x !== i) : [...s, i]));
              setRev(false);
            }}
            className={`${botonBase} min-w-14 text-center ${
              sel.includes(i) ? "bg-secondary text-secondary-foreground" : ""
            }`}
          >
            {it}
          </button>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <button type="button" className={botonAccion} onClick={() => setRev(true)}>
          Comprobar
        </button>
        <button
          type="button"
          className={botonBase}
          onClick={() => {
            setSel([]);
            setRev(false);
          }}
        >
          Reiniciar
        </button>
      </div>
      <Feedback
        estado={rev ? (correcto ? "ok" : "mal") : null}
        texto={
          rev && !correcto
            ? `Lleva ${sel.filter((s) => ej.correctas.includes(s)).length} de ${ej.correctas.length} correctas. Revise su selección.`
            : undefined
        }
      />
    </div>
  );
}

function Orden({ ej }: { ej: Extract<Ejercicio, { tipo: "orden" }> }) {
  const barajado = useMemo(() => {
    const copia = ej.pasos.map((p, i) => ({ p, i }));
    for (let k = copia.length - 1; k > 0; k--) {
      const j = (k * 7 + 3) % (k + 1);
      const a = copia[k]!;
      const b = copia[j]!;
      copia[k] = b;
      copia[j] = a;
    }
    return copia;
  }, [ej]);
  const [orden, setOrden] = useState(barajado);
  const [rev, setRev] = useState(false);
  const correcto = orden.every((o, idx) => o.i === idx);

  const mover = (from: number, to: number) => {
    if (to < 0 || to >= orden.length) return;
    const copia = [...orden];
    const a = copia[from]!;
    const b = copia[to]!;
    copia[from] = b;
    copia[to] = a;
    setOrden(copia);
    setRev(false);
  };

  return (
    <div>
      <ol className="mt-4 grid gap-3">
        {orden.map((o, idx) => (
          <li key={o.p} className="flex items-center gap-3 rounded-lg border-2 border-border p-3">
            <span className="text-lg font-semibold">{idx + 1}.</span>
            <span className="flex-1">{o.p}</span>
            <button
              type="button"
              aria-label={`Subir: ${o.p}`}
              className={`${botonBase} px-3`}
              onClick={() => mover(idx, idx - 1)}
            >
              ↑
            </button>
            <button
              type="button"
              aria-label={`Bajar: ${o.p}`}
              className={`${botonBase} px-3`}
              onClick={() => mover(idx, idx + 1)}
            >
              ↓
            </button>
          </li>
        ))}
      </ol>
      <div className="mt-4 flex flex-wrap gap-3">
        <button type="button" className={botonAccion} onClick={() => setRev(true)}>
          Comprobar
        </button>
        <button
          type="button"
          className={botonBase}
          onClick={() => {
            setOrden(barajado);
            setRev(false);
          }}
        >
          Reiniciar
        </button>
      </div>
      <Feedback estado={rev ? (correcto ? "ok" : "mal") : null} />
    </div>
  );
}

function Emparejar({ ej }: { ej: Extract<Ejercicio, { tipo: "emparejar" }> }) {
  const derechas = useMemo(
    () => ej.pares.map((p) => p.derecha).slice().sort((a, b) => a.localeCompare(b)),
    [ej],
  );
  const [asig, setAsig] = useState<Record<string, string>>({});
  const [rev, setRev] = useState(false);
  const correcto = ej.pares.every((p) => asig[p.izquierda] === p.derecha);
  return (
    <div>
      <div className="mt-4 grid gap-3">
        {ej.pares.map((p) => (
          <label key={p.izquierda} className="grid gap-2 rounded-lg border-2 border-border p-3">
            <span className="text-lg font-semibold">{p.izquierda}</span>
            <select
              className="min-h-12 rounded-lg border-2 border-border bg-card px-3 text-base"
              value={asig[p.izquierda] ?? ""}
              onChange={(e) => {
                setAsig((a) => ({ ...a, [p.izquierda]: e.target.value }));
                setRev(false);
              }}
            >
              <option value="">Elija una opción…</option>
              {derechas.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <button type="button" className={botonAccion} onClick={() => setRev(true)}>
          Comprobar
        </button>
        <button
          type="button"
          className={botonBase}
          onClick={() => {
            setAsig({});
            setRev(false);
          }}
        >
          Reiniciar
        </button>
      </div>
      <Feedback estado={rev ? (correcto ? "ok" : "mal") : null} />
    </div>
  );
}

function Texto({ ej }: { ej: Extract<Ejercicio, { tipo: "texto" }> }) {
  const [vals, setVals] = useState<string[]>(ej.preguntas.map(() => ""));
  const [rev, setRev] = useState(false);
  const aciertos = ej.preguntas.filter((p, i) =>
    p.respuestas.some((r) => normalizar(r) === normalizar(vals[i] ?? "")),
  ).length;
  return (
    <div>
      <div className="mt-4 grid gap-4">
        {ej.preguntas.map((p, i) => (
          <label key={p.pregunta} className="grid gap-2">
            <span className="text-lg font-semibold">{p.pregunta}</span>
            <input
              type="text"
              value={vals[i]}
              onChange={(e) => {
                const c = [...vals];
                c[i] = e.target.value;
                setVals(c);
                setRev(false);
              }}
              className="min-h-12 rounded-lg border-2 border-border bg-card px-3 text-base"
            />
            {rev && (
              <span className="text-base font-semibold">
                {p.respuestas.some((r) => normalizar(r) === normalizar(vals[i] ?? ""))
                  ? "Correcto"
                  : `Revise: una respuesta posible es «${p.respuestas[0]}»`}
              </span>
            )}
          </label>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <button type="button" className={botonAccion} onClick={() => setRev(true)}>
          Comprobar
        </button>
        <button
          type="button"
          className={botonBase}
          onClick={() => {
            setVals(ej.preguntas.map(() => ""));
            setRev(false);
          }}
        >
          Reiniciar
        </button>
      </div>
      <Feedback
        estado={rev ? (aciertos === ej.preguntas.length ? "ok" : "mal") : null}
        texto={rev ? `Respuestas correctas: ${aciertos} de ${ej.preguntas.length}.` : undefined}
      />
    </div>
  );
}

function MemoriaLista({ ej }: { ej: Extract<Ejercicio, { tipo: "memoria-lista" }> }) {
  const distractores = ["Café", "Azúcar", "Pollo", "Servilletas"];
  const opciones = useMemo(
    () => [...ej.lista, ...distractores].slice().sort((a, b) => a.localeCompare(b)),
    [ej],
  );
  const [fase, setFase] = useState<"inicio" | "memorizar" | "responder">("inicio");
  const [seg, setSeg] = useState(ej.segundos);
  const [sel, setSel] = useState<string[]>([]);
  const [rev, setRev] = useState(false);

  useEffect(() => {
    if (fase !== "memorizar") return;
    if (seg <= 0) {
      setFase("responder");
      return;
    }
    const t = setTimeout(() => setSeg((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [fase, seg]);

  const correcto =
    sel.length === ej.lista.length && ej.lista.every((l) => sel.includes(l));

  if (fase === "inicio") {
    return (
      <div className="mt-4">
        <button
          type="button"
          className={botonAccion}
          onClick={() => {
            setSeg(ej.segundos);
            setFase("memorizar");
          }}
        >
          Comenzar y ver la lista
        </button>
      </div>
    );
  }

  if (fase === "memorizar") {
    return (
      <div className="mt-4">
        <p className="text-lg font-semibold" role="timer">
          Memorice… quedan {seg} segundos
        </p>
        <ul className="mt-3 flex flex-wrap gap-3">
          {ej.lista.map((l) => (
            <li key={l} className="rounded-lg border-2 border-border px-4 py-2 text-lg font-semibold">
              {l}
            </li>
          ))}
        </ul>
        <button type="button" className={`${botonBase} mt-4`} onClick={() => setFase("responder")}>
          Ya la memoricé
        </button>
      </div>
    );
  }

  return (
    <div>
      <p className="mt-4 text-lg font-semibold">Marque los productos que estaban en la lista.</p>
      <div className="mt-3 flex flex-wrap gap-3">
        {opciones.map((o) => (
          <button
            key={o}
            type="button"
            aria-pressed={sel.includes(o)}
            onClick={() => {
              setSel((s) => (s.includes(o) ? s.filter((x) => x !== o) : [...s, o]));
              setRev(false);
            }}
            className={`${botonBase} ${sel.includes(o) ? "bg-secondary text-secondary-foreground" : ""}`}
          >
            {o}
          </button>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <button type="button" className={botonAccion} onClick={() => setRev(true)}>
          Comprobar
        </button>
        <button
          type="button"
          className={botonBase}
          onClick={() => {
            setSel([]);
            setRev(false);
            setFase("inicio");
          }}
        >
          Reiniciar
        </button>
      </div>
      <Feedback
        estado={rev ? (correcto ? "ok" : "mal") : null}
        texto={
          rev && !correcto
            ? `Recordó ${sel.filter((s) => ej.lista.includes(s)).length} de ${ej.lista.length} productos.`
            : undefined
        }
      />
    </div>
  );
}

function Clasificar({ ej }: { ej: Extract<Ejercicio, { tipo: "clasificar" }> }) {
  const [asig, setAsig] = useState<Record<string, string>>({});
  const [rev, setRev] = useState(false);
  const aciertos = ej.items.filter((it) => asig[it.texto] === it.grupo).length;
  const correcto = aciertos === ej.items.length;
  return (
    <div>
      <div className="mt-4 grid gap-3">
        {ej.items.map((it) => (
          <div
            key={it.texto}
            className="flex flex-wrap items-center gap-3 rounded-lg border-2 border-border p-3"
          >
            <span className="flex-1 text-lg font-semibold">{it.texto}</span>
            {ej.grupos.map((g) => (
              <button
                key={g}
                type="button"
                aria-pressed={asig[it.texto] === g}
                aria-label={`${it.texto}: ${g}`}
                onClick={() => {
                  setAsig((a) => ({ ...a, [it.texto]: g }));
                  setRev(false);
                }}
                className={`${botonBase} ${
                  asig[it.texto] === g ? "bg-secondary text-secondary-foreground" : ""
                }`}
              >
                {g}
              </button>
            ))}
            {rev && (
              <span className="w-full text-base font-semibold">
                {asig[it.texto] === it.grupo ? "Correcto" : `Corresponde a: ${it.grupo}`}
              </span>
            )}
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <button type="button" className={botonAccion} onClick={() => setRev(true)}>
          Comprobar
        </button>
        <button
          type="button"
          className={botonBase}
          onClick={() => {
            setAsig({});
            setRev(false);
          }}
        >
          Reiniciar
        </button>
      </div>
      <Feedback
        estado={rev ? (correcto ? "ok" : "mal") : null}
        texto={rev ? `Clasificó correctamente ${aciertos} de ${ej.items.length}.` : undefined}
      />
    </div>
  );
}

function VerdaderoFalso({ ej }: { ej: Extract<Ejercicio, { tipo: "verdadero-falso" }> }) {
  const [resp, setResp] = useState<Record<number, boolean>>({});
  const [rev, setRev] = useState(false);
  const aciertos = ej.afirmaciones.filter((a, i) => resp[i] === a.correcta).length;
  const correcto = aciertos === ej.afirmaciones.length;
  return (
    <div>
      <div className="mt-4 grid gap-3">
        {ej.afirmaciones.map((a, i) => (
          <div
            key={a.texto}
            className="flex flex-wrap items-center gap-3 rounded-lg border-2 border-border p-3"
          >
            <span className="flex-1 text-lg font-semibold">{a.texto}</span>
            {[true, false].map((v) => (
              <button
                key={String(v)}
                type="button"
                aria-pressed={resp[i] === v}
                aria-label={`${a.texto}: ${v ? "Verdadero" : "Falso"}`}
                onClick={() => {
                  setResp((r) => ({ ...r, [i]: v }));
                  setRev(false);
                }}
                className={`${botonBase} ${
                  resp[i] === v ? "bg-secondary text-secondary-foreground" : ""
                }`}
              >
                {v ? "Verdadero" : "Falso"}
              </button>
            ))}
            {rev && (
              <span className="w-full text-base font-semibold">
                {resp[i] === a.correcta
                  ? "Correcto"
                  : `La respuesta correcta es: ${a.correcta ? "Verdadero" : "Falso"}`}
              </span>
            )}
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <button type="button" className={botonAccion} onClick={() => setRev(true)}>
          Comprobar
        </button>
        <button
          type="button"
          className={botonBase}
          onClick={() => {
            setResp({});
            setRev(false);
          }}
        >
          Reiniciar
        </button>
      </div>
      <Feedback
        estado={rev ? (correcto ? "ok" : "mal") : null}
        texto={rev ? `Acertó ${aciertos} de ${ej.afirmaciones.length}.` : undefined}
      />
    </div>
  );
}

export function EjercicioInteractivo({ ejercicio }: { ejercicio: Ejercicio }) {
  return (
    <article className="surface-card p-6">
      <h3 className="font-serif text-2xl font-semibold">{ejercicio.titulo}</h3>
      <p className="mt-2 text-muted-foreground">{ejercicio.instrucciones}</p>
      {ejercicio.tipo === "opcion-multiple" && <OpcionMultiple ej={ejercicio} />}
      {ejercicio.tipo === "seleccion-multiple" && <SeleccionMultiple ej={ejercicio} />}
      {ejercicio.tipo === "orden" && <Orden ej={ejercicio} />}
      {ejercicio.tipo === "emparejar" && <Emparejar ej={ejercicio} />}
      {ejercicio.tipo === "texto" && <Texto ej={ejercicio} />}
      {ejercicio.tipo === "memoria-lista" && <MemoriaLista ej={ejercicio} />}
      {ejercicio.tipo === "clasificar" && <Clasificar ej={ejercicio} />}
      {ejercicio.tipo === "verdadero-falso" && <VerdaderoFalso ej={ejercicio} />}
    </article>
  );
}
