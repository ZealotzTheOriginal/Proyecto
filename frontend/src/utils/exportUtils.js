import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

// Exportar a PDF
export const exportToPDF = (voluntarios, donaciones, transportes) => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("📊 Informe Fundación Nexa", 14, 20);

  doc.setFontSize(12);
  doc.text(`Total voluntarios: ${voluntarios.length}`, 14, 30);
  doc.text(`Total donaciones: ${donaciones.length}`, 14, 38);
  doc.text(`Total transportes: ${transportes.length}`, 14, 46);

  // Tabla Voluntarios
  doc.text("Voluntarios", 14, 60);
  doc.autoTable({
    startY: 65,
    head: [["ID", "Nombre", "Email", "Teléfono"]],
    body: voluntarios.map(v => [v.id, v.nombre, v.email || "—", v.telefono || "—"]),
  });

  // Tabla Donaciones
  let finalY = doc.lastAutoTable.finalY + 10;
  doc.text("Donaciones", 14, finalY);
  doc.autoTable({
    startY: finalY + 5,
    head: [["ID", "Tipo", "Valor (€)", "Descripción"]],
    body: donaciones.map(d => [d.id, d.tipo, d.valor || 0, d.descripcion || "—"]),
  });

  // Tabla Transportes
  finalY = doc.lastAutoTable.finalY + 10;
  doc.text("Transportes", 14, finalY);
  doc.autoTable({
    startY: finalY + 5,
    head: [["ID", "Vehículo", "Conductor", "Disponibilidad"]],
    body: transportes.map(t => [t.id, t.vehiculo, t.conductor || "—", t.disponibilidad]),
  });

  doc.save("Informe_Fundacion_Nexa.pdf");
};

// Exportar a Excel
export const exportToExcel = (voluntarios, donaciones, transportes) => {
  const wb = XLSX.utils.book_new();

  // Voluntarios
  const wsVol = XLSX.utils.json_to_sheet(voluntarios);
  XLSX.utils.book_append_sheet(wb, wsVol, "Voluntarios");

  // Donaciones
  const wsDon = XLSX.utils.json_to_sheet(donaciones);
  XLSX.utils.book_append_sheet(wb, wsDon, "Donaciones");

  // Transportes
  const wsTrans = XLSX.utils.json_to_sheet(transportes);
  XLSX.utils.book_append_sheet(wb, wsTrans, "Transportes");

  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  saveAs(new Blob([wbout], { type: "application/octet-stream" }), "Informe_Fundacion_Nexa.xlsx");
};
