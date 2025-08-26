export function roundToTwo(num: number): number {
  return Math.round(num * 100) / 100;
}

export function sanitize(value?: string) {
  if (!value) return '';
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

export function convertMoneyToNumber(value: string): number {
  if (!value) return 0;
  if (typeof value === 'number') return value;
  const sanitizedValue = value
    .replace(/\./g, '')
    .replace(/,/g, '.')
    .replace('R$', '')
    .trim();
  return parseFloat(sanitizedValue);
}

export function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

export function average(values: number[]): number {
  return values.reduce((sum, val) => sum + val, 0) / values.length;
}
