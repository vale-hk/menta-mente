// Generación de informes PDF en el navegador (jsPDF + autotable).
type Barra = { etiqueta: string; valor: number };

function rgb(pct: number): [number, number, number] {
  if (pct <= 45) return [239, 68, 68];
  if (pct <= 75) return [250, 204, 21];
  if (pct <= 89) return [52, 211, 153];
  return [22, 101, 52];
}

async function crearDoc() {
  const { jsPDF } = await import("jspdf");
  const autoTable = (await import("jspdf-autotable")).default;
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  return { doc, autoTable };
}

function encabezado(doc: import("jspdf").jsPDF, titulo: string) {
  doc.setFillColor(16, 160, 110);
  doc.rect(0, 0, 210, 26, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("Menta", 14, 14);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Mentaliza, Memoriza & Mejora.", 14, 21);
  doc.setFontSize(12);
  doc.text(titulo, 196, 16, { align: "right" });
  doc.setTextColor(20, 20, 20);
}

function grafico(doc: import("jspdf").jsPDF, y: number, titulo: string, barras: Barra[]) {
  const x0 = 24, ancho = 172, alto = 60;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text(titulo, 14, y);
  const base = y + 8 + alto;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setDrawColor(200, 200, 200);
  for (let v = 0; v <= 100; v += 25) {
    const yy = base - (v / 100) * alto;
    doc.line(x0, yy, x0 + ancho, yy);
    doc.text(`${v}%`, x0 - 2, yy + 1, { align: "right" });
  }
  const paso = ancho / Math.max(1, barras.length);
  barras.forEach((b, i) => {
    const h = (Math.max(0, Math.min(100, b.valor)) / 100) * alto;
    const bx = x0 + i * paso + paso * 0.18;
    doc.setFillColor(...rgb(b.valor));
    if (h > 0) doc.rect(bx, base - h, paso * 0.64, h, "F");
    doc.setTextColor(20, 20, 20);
    doc.text(`${b.valor}%`, bx + paso * 0.32, base - h - 1.5, { align: "center" });
    doc.text(doc.splitTextToSize(b.etiqueta, paso - 1), bx + paso * 0.32, base + 4, { align: "center" });
  });
  return base + 14;
}

function pie(doc: import("jspdf").jsPDF) {
  const n = doc.getNumberOfPages();
  for (let i = 1; i <= n; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(110, 110, 110);
    doc.text(`Generado el ${new Date().toLocaleDateString("es-CL")} · Página ${i} de ${n}`, 105, 290, { align: "center" });
  }
}

export type DatosInformeUsuario = {
  nombre: string;
  periodo: string;
  pctGeneral: number;
  puntos: number;
  maximo: number;
  areas: { titulo: string; puntos: number; maximo: number; pct: number; intentos: number }[];
  intentos: { fecha: string; area: string; ejercicio: string; puntaje: number }[];
  evolucion: Barra[];
};

export async function pdfUsuario(d: DatosInformeUsuario) {
  const { doc, autoTable } = await crearDoc();
  encabezado(doc, `Informe ${d.periodo}`);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(`¡Hola, ${d.nombre || "querido/a usuario/a"}!`, 14, 38);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(
    doc.splitTextToSize(
      "Gracias por dedicar tiempo a cuidar su mente. Cada ejercicio realizado es un paso valioso. Aquí encontrará un resumen de sus resultados; siga avanzando a su propio ritmo.",
      182,
    ),
    14,
    46,
  );
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text(`Logro general: ${d.pctGeneral}%  (${d.puntos} / ${d.maximo} pts)`, 14, 64);
  autoTable(doc, {
    startY: 69,
    head: [["Área", "Puntaje", "Logro", "Intentos"]],
    body: d.areas.map((a) => [a.titulo, `${a.puntos} / ${a.maximo}`, `${a.pct}%`, String(a.intentos)]),
    headStyles: { fillColor: [16, 160, 110] },
    styles: { fontSize: 11 },
  });
  // @ts-expect-error propiedad agregada por autotable
  let y = (doc.lastAutoTable.finalY as number) + 12;
  y = grafico(doc, y, "Evolución de su logro", d.evolucion);
  autoTable(doc, {
    startY: y,
    head: [["Fecha", "Área", "Ejercicio", "Puntaje"]],
    body: d.intentos.map((i) => [i.fecha, i.area, i.ejercicio, `${i.puntaje}/10`]),
    headStyles: { fillColor: [16, 160, 110] },
    styles: { fontSize: 9 },
  });
  pie(doc);
  doc.save(`informe-menta-${d.periodo.toLowerCase().replace(/\s+/g, "-")}.pdf`);
}

export type FilaAdmin = {
  id: string; usuario: string; edad: number | null; sexo: string | null; comuna: string | null;
  atencion: number | null; memoria: number | null; funciones: number | null; lenguaje: number | null;
  ultimaActividad: string | null;
};

export async function pdfAdmin(filas: FilaAdmin[], filtros: string, areas: Barra[]) {
  const { doc, autoTable } = await crearDoc();
  encabezado(doc, "Informe clínico");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.text("Reporte de rendimiento cognitivo", 14, 38);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(doc.splitTextToSize(`Filtros aplicados: ${filtros}`, 182), 14, 45);
  doc.text(`Personas usuarias incluidas: ${filas.length}`, 14, 55);
  let y = grafico(doc, 64, "Logro promedio por área cognitiva", areas);
  const f = (v: number | null) => (v === null ? "—" : `${v}%`);
  autoTable(doc, {
    startY: y,
    head: [["ID", "Usuario", "Edad", "Sexo", "Comuna", "Aten.", "Mem.", "F. Ejec.", "Leng.", "Última act."]],
    body: filas.map((r) => [
      r.id, r.usuario, r.edad ?? "—", r.sexo ?? "—", r.comuna ?? "—",
      f(r.atencion), f(r.memoria), f(r.funciones), f(r.lenguaje),
      r.ultimaActividad ? new Date(r.ultimaActividad).toLocaleDateString("es-CL") : "—",
    ]),
    headStyles: { fillColor: [16, 160, 110] },
    styles: { fontSize: 8 },
    didParseCell: (c) => {
      if (c.section !== "body" || c.column.index < 5 || c.column.index > 8) return;
      const v = parseInt(String(c.cell.raw), 10);
      if (Number.isNaN(v)) return;
      c.cell.styles.fillColor = rgb(v);
      c.cell.styles.textColor = v >= 90 ? [255, 255, 255] : [17, 17, 17];
      c.cell.styles.fontStyle = "bold";
    },
  });
  y = 0;
  pie(doc);
  doc.save(`informe-clinico-menta-${new Date().toISOString().slice(0, 10)}.pdf`);
}
