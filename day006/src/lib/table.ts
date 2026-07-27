export type TableCells = string[][];

const normalizeRows = (rows: TableCells): TableCells => {
  const columnCount = Math.max(1, ...rows.map((row) => row.length));
  return rows.map((row) => Array.from({ length: columnCount }, (_, index) => row[index] ?? ""));
};

export const cellsFromClipboard = (text: string): TableCells => {
  const lines = text.replace(/\r\n?/g, "\n").replace(/\n$/, "").split("\n");
  if (lines.length === 1 && lines[0] === "") return [[""]];
  return normalizeRows(lines.map((line) => line.split("\t")));
};

const escapeCell = (value: string) => value
  .replace(/\\/g, "\\\\")
  .replace(/\|/g, "\\|")
  .replace(/\r?\n/g, "<br>");

export const markdownFromTable = (cells: TableCells): string => {
  const normalized = normalizeRows(cells.length ? cells : [[""]]);
  const formatRow = (row: string[]) => `| ${row.map(escapeCell).join(" | ")} |`;
  const divider = `| ${normalized[0].map(() => "---").join(" | ")} |`;
  return [formatRow(normalized[0]), divider, ...normalized.slice(1).map(formatRow)].join("\n");
};

export const updateCell = (cells: TableCells, rowIndex: number, columnIndex: number, value: string): TableCells =>
  cells.map((row, currentRow) => currentRow === rowIndex
    ? row.map((cell, currentColumn) => currentColumn === columnIndex ? value : cell)
    : row);
