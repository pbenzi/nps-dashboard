// ─────────────────────────────────────────────
// hooks/useSheetData.js
// ─────────────────────────────────────────────
import { useState, useCallback } from 'react';
import Papa from 'papaparse';
import { enrichRow } from '../lib/nps';

const SHEET_ID   = import.meta.env.VITE_SHEET_ID;
const SHEET_NAME = import.meta.env.VITE_SHEET_NAME || 'Sheet1';

// URL pública de exportação CSV — não precisa de API Key
// A planilha precisa estar com acesso "qualquer pessoa com o link pode ver"
function buildCSVUrl() {
  const encoded = encodeURIComponent(SHEET_NAME);
  return `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encoded}`;
}

export function useSheetData() {
  const [rawData,  setRawData]  = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);
  const [lastSync, setLastSync] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const url      = buildCSVUrl();
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const text = await response.text();

      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: false,
        complete(results) {
          const rows = results.data;
          if (!rows.length) {
            setError('A planilha parece estar vazia.');
            setLoading(false);
            return;
          }
          const cols = Object.keys(rows[0]);
          if (!cols.includes('nps_category') || !cols.includes('nps_answer_period')) {
            setError('Colunas obrigatórias não encontradas. Verifique a estrutura da planilha.');
            setLoading(false);
            return;
          }
          setRawData(rows.map(enrichRow));
          setLastSync(new Date());
          setLoading(false);
        },
        error(err) {
          setError(`Erro ao processar CSV: ${err.message}`);
          setLoading(false);
        },
      });
    } catch (e) {
      setError(`Erro ao buscar dados: ${e.message}`);
      setLoading(false);
    }
  }, []);

  return { rawData, loading, error, lastSync, fetchData };
}
