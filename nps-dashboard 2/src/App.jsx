// ─────────────────────────────────────────────
// App.jsx — Componente raiz
// ─────────────────────────────────────────────
import { useState, useEffect, useMemo } from 'react';
import { useAuth }       from './hooks/useAuth';
import { useSheetData }  from './hooks/useSheetData';
import { getMonths, filterByMonth } from './lib/nps';
import { exportToCsv }   from './lib/exportCsv';

import LoginScreen from './components/LoginScreen';
import Topbar      from './components/Topbar';
import { LoadingState, ErrorState } from './components/Primitives';

import VisaoGeral  from './components/tabs/VisaoGeral';
import Mensal      from './components/tabs/Mensal';
import PorPeriodo  from './components/tabs/PorPeriodo';
import PorPlano    from './components/tabs/PorPlano';
import Engajamento from './components/tabs/Engajamento';
import Nivel       from './components/tabs/Nivel';
import Risco       from './components/tabs/Risco';
import Detratores  from './components/tabs/Detratores';

export default function App() {
  const { session, isLoggedIn, isAdmin, login, logout } = useAuth();
  const { rawData, loading, error, lastSync, fetchData } = useSheetData();

  const [activeTab,     setActiveTab]     = useState('visao-geral');
  const [selectedMonth, setSelectedMonth] = useState('');

  // Busca dados assim que o user faz login
  useEffect(() => {
    if (isLoggedIn && rawData.length === 0) {
      fetchData();
    }
  }, [isLoggedIn]); // eslint-disable-line

  // Datasets derivados
  const all      = rawData;
  const answered = useMemo(
    () => rawData.filter(r => r._cat_nps !== "Didn't answer"),
    [rawData]
  );
  const months   = useMemo(() => getMonths(answered), [answered]);

  // Aplica filtro de mês
  const filteredAll      = useMemo(() => filterByMonth(all,      selectedMonth), [all,      selectedMonth]);
  const filteredAnswered = useMemo(() => filterByMonth(answered, selectedMonth), [answered, selectedMonth]);

  // Exportação
  function handleExport() {
    const rows = filteredAnswered.length ? filteredAnswered : answered;
    const suffix = selectedMonth ? `_${selectedMonth}` : '_completo';
    exportToCsv(rows, `nps-alura${suffix}`);
  }

  // ── Login screen ──────────────────────────────
  if (!isLoggedIn) {
    return <LoginScreen onLogin={login} />;
  }

  // ── Loading (primeira carga) ──────────────────
  if (loading && rawData.length === 0) {
    return (
      <>
        <style>{globalStyles}</style>
        <div style={appStyle}>
          <LoadingState message="Buscando dados do Google Sheets..." />
        </div>
      </>
    );
  }

  // ── Error ─────────────────────────────────────
  if (error && rawData.length === 0) {
    return (
      <>
        <style>{globalStyles}</style>
        <div style={appStyle}>
          <ErrorState message={error} onRetry={fetchData} />
        </div>
      </>
    );
  }

  // ── Dashboard ─────────────────────────────────
  return (
    <>
      <style>{globalStyles}</style>
      <div style={appStyle}>
        <Topbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          allCount={all.length}
          answeredCount={answered.length}
          months={months}
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          isAdmin={isAdmin}
          onRefresh={fetchData}
          lastSync={lastSync}
          loadingRefresh={loading}
          onLogout={logout}
          onExport={handleExport}
        />

        {/* Aviso de atualização em segundo plano */}
        {loading && rawData.length > 0 && (
          <div style={refreshBanner}>
            ↻ Atualizando dados...
          </div>
        )}

        {/* Aviso de erro não crítico */}
        {error && rawData.length > 0 && (
          <div style={errorBanner}>
            ⚠ Erro ao atualizar: {error}
          </div>
        )}

        <div style={contentStyle}>
          {activeTab === 'visao-geral'  && <VisaoGeral  all={filteredAll} answered={filteredAnswered} />}
          {activeTab === 'mensal'       && <Mensal       answered={filteredAnswered} />}
          {activeTab === 'por-periodo'  && <PorPeriodo   answered={filteredAnswered} />}
          {activeTab === 'por-plano'    && <PorPlano     answered={filteredAnswered} />}
          {activeTab === 'engajamento'  && <Engajamento  answered={filteredAnswered} />}
          {activeTab === 'nivel'        && <Nivel        answered={filteredAnswered} />}
          {activeTab === 'risco'        && <Risco        answered={filteredAnswered} />}
          {activeTab === 'detratores'   && <Detratores   answered={filteredAnswered} />}
        </div>
      </div>
    </>
  );
}

// ── Styles ─────────────────────────────────────
const appStyle = {
  minHeight: '100vh',
  background: '#F2F0E8',
  fontFamily: "'DM Sans', sans-serif",
};

const contentStyle = {
  maxWidth: '1140px',
  margin: '0 auto',
  padding: '2rem 1.5rem',
};

const refreshBanner = {
  background: '#EAF3E6',
  borderBottom: '1px solid #B8DBA8',
  color: '#2D6A1F',
  fontSize: '12px',
  padding: '6px 1.5rem',
  fontFamily: "'DM Sans', sans-serif",
};

const errorBanner = {
  background: '#FDEAEA',
  borderBottom: '1px solid #F5B8B8',
  color: '#9B2020',
  fontSize: '12px',
  padding: '6px 1.5rem',
  fontFamily: "'DM Sans', sans-serif",
};

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: #F2F0E8;
    font-family: 'DM Sans', sans-serif;
    -webkit-font-smoothing: antialiased;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* Scrollbar discreta */
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #C8C4B8; border-radius: 3px; }

  button { font-family: 'DM Sans', sans-serif; }
  input, select, textarea { font-family: 'DM Sans', sans-serif; }
`;
