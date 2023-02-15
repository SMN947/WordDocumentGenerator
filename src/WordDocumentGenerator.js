import React, { useState } from "react";
import { Document, Packer, Table, TableRow, TableCell, Paragraph } from "docx";
import { saveAs } from "file-saver";

function WordDocumentGenerator() {
  const [docxFile, setDocxFile] = useState(null);
  const [tableRows, setTableRows] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setDocxFile(file);
  };

  const handleAddRow = () => {
    setTableRows([...tableRows, { id: tableRows.length + 1, name: `Row ${tableRows.length + 1}` }]);
  };

  const handleGenerateDocument = () => {
    if (!docxFile) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const buffer = event.target.result;
      const doc = new Document(buffer);

      const newDoc = new Document();
      doc.sections.forEach((section) => {
        const newSection = section.clone();
        const newTables = [];

        section.tables.forEach((table) => {
          const newTable = table.clone();
          if (table.caption) {
            newTable.caption = table.caption.clone();
          }
          const newRows = [];
          table.rows.forEach((row) => {
            const newRow = row.clone();
            row.cells.forEach((cell) => {
              const newCell = cell.clone();
              if (cell.children.length > 0 && cell.children[0].text === "Rows Placeholder") {
                tableRows.forEach((rowData) => {
                  const tableCells = Object.values(rowData);
                  const tableCellsNodes = tableCells.map((cellData) => new TableCell({ children: [new Paragraph(cellData)] }));
                  newRows.push(new TableRow({ children: tableCellsNodes }));
                });
              }
            });
            if (newRows.length === 0) {
              newRows.push(newRow);
            }
          });
          newTable.rows = newRows;
          newTables.push(newTable);
        });
        newSection.tables = newTables;
        newDoc.addSection(newSection);
      });

      Packer.toBlob(newDoc).then((blob) => {
        saveAs(blob, "new_document.docx");
      });
    };

    reader.readAsArrayBuffer(docxFile);
  };

  return (
    <div>
      <input type="file" accept=".docx" onChange={handleFileUpload} />
      <button onClick={handleAddRow}>Add Row</button>
      <button onClick={handleGenerateDocument} disabled={!docxFile}>
        Generate Document
      </button>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {tableRows.map((row) => (
            <tr key={row.id}>
              <td>{row.id}</td>
              <td>{row.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default WordDocumentGenerator;
