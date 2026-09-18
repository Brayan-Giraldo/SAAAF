export function formatDate(value) {
  if (!value) return '-';
  return new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium' }).format(new Date(`${value}T12:00:00`));
}

export function nextCode(prefix, items) {
  const next = items.length + 1;
  return `${prefix}-${String(next).padStart(4, '0')}`;
}
