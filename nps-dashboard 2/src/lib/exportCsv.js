// ─────────────────────────────────────────────
// lib/exportCsv.js
// ─────────────────────────────────────────────

/**
 * Exporta um array de objetos como CSV e dispara o download no browser.
 * @param {Array<Object>} rows  - dados a exportar
 * @param {string}        name  - nome do arquivo (sem extensão)
 */
export function exportToCsv(rows, name = 'nps-export') {
  if (!rows || !rows.length) return;

  // Pega as colunas originais (sem as internas _*)
  const originalKeys = Object.keys(rows[0]).filter(k => !k.startsWith('_'));

  const escape = val => {
    if (val === null || val === undefined) return '';
    const str = String(val);
    return str.includes(',') || str.includes('"') || str.includes('\n')
      ? `"${str.replace(/"/g, '""')}"`
      : str;
  };

  const header = originalKeys.map(escape).join(',');
  const body   = rows.map(r => originalKeys.map(k => escape(r[k])).join(','));

  const csv  = [header, ...body].join('\r\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);

  const a       = document.createElement('a');
  a.href        = url;
  a.download    = `${name}.csv`;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
