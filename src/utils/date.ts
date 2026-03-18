export function formatMonthYear(value?: string | null) {
  if (!value) return "";

  const date = new Date(value);

  return date.toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });
}

export function toYearMonth(value?: string | null) {
  if (!value) return "";

  const date = new Date(value);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");

  return `${year}-${month}`;
}

export function parseYearMonth(value?: string | null) {
  if (!value) return null;

  const [year, month] = value.split("-");
  return new Date(Number(year), Number(month) - 1);
}

export function formatToYearMonth(date?: Date | null) {
  if (!date) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");

  return `${year}-${month}`;
}
