// ─────────────────────────────────────────────
// components/Topbar.jsx
// ─────────────────────────────────────────────
import { useState } from 'react';
import { fmt, monthLabel } from '../lib/nps';

const TABS = [
  { id: 'visao-geral', label: 'Visão Geral' },
  { id: 'mensal',      label: 'Mês a Mês' },
  { id: 'por-periodo', label: 'Ciclo' },
  { id: 'por-plano',   label: 'Planos' },
  { id: 'engajamento', label: 'Engajamento' },
  { id: 'nivel',       label: 'Nível do Aluno' },
  { id: 'risco',       label: 'Risco de Churn' },
  { id: 'detratores',  label: 'Detratores' },
];

export default function Topbar({
  activeTab, setActiveTab,
  allCount, answeredCount,
  months, selectedMonth, setSelectedMonth,
  isAdmin, onRefresh, lastSync, loadingRefresh,
  onLogout, onExport,
}) {
  const [showAdminMenu, setShowAdminMenu] = useState(false);

  const metaText = months.length
    ? `${fmt(allCount)} registros · ${fmt(answeredCount)} respondentes · ${monthLabel(months[0])}–${monthLabel(months[months.length - 1])}`
    : '';

  return (
    <div style={styles.bar}>
      {/* Brand */}
      <div style={styles.brand}>
        <span style={styles.brandNps}>NPS</span>
        <span style={styles.brandAlura}>Alura B2C</span>
      </div>

      {/* Meta */}
      {metaText && <span style={styles.meta}>{metaText}</span>}

      {/* Tabs */}
      <nav style={styles.tabs}>
        {TABS.map(t => (
          <button
            key={t.id}
            style={{ ...styles.tab, ...(activeTab === t.id ? styles.tabActive : {}) }}
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {/* Month filter */}
      {months.length > 0 && (
        <div style={styles.filterWrap}>
          <label style={styles.filterLabel}>Mês</label>
          <select
            style={styles.select}
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
          >
            <option value="">Todos</option>
            {months.map(m => (
              <option key={m} value={m}>{monthLabel(m)}</option>
            ))}
          </select>
        </div>
      )}

      {/* Export */}
      <button style={styles.actionBtn} onClick={onExport} title="Exportar CSV filtrado">
        ↓ Exportar CSV
      </button>

      {/* Admin */}
      {isAdmin && (
        <div style={{ position: 'relative' }}>
          <button
            style={{ ...styles.actionBtn, background: '#1A1916', color: '#fff' }}
            onClick={() => setShowAdminMenu(v => !v)}
          >
            ⚙ Admin
          </button>
          {showAdminMenu && (
            <div style={styles.dropdown}>
              <button
                style={styles.dropItem}
                onClick={() => { onRefresh(); setShowAdminMenu(false); }}
                disabled={loadingRefresh}
              >
                {loadingRefresh ? '↻ Atualizando...' : '↻ Atualizar dados'}
              </button>
              {lastSync && (
                <span style={styles.dropMeta}>
                  Último sync: {lastSync.toLocaleTimeString('pt-BR')}
                </span>
              )}
              <hr style={styles.dropDivider} />
              <button style={{ ...styles.dropItem, color: '#9B2020' }} onClick={onLogout}>
                Sair
              </button>
            </div>
          )}
        </div>
      )}

      {/* Logout for non-admin */}
      {!isAdmin && (
        <button style={styles.actionBtn} onClick={onLogout}>
          Sair
        </button>
      )}
    </div>
  );
}

const styles = {
  bar: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    background: '#FFFFFF',
    borderBottom: '1px solid #E0DDD4',
    padding: '0 1.25rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    height: '56px',
    overflowX: 'auto',
    fontFamily: "'DM Sans', sans-serif",
  },
  brand: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '6px',
    flexShrink: 0,
  },
  brandNps: {
    fontFamily: "'DM Serif Display', serif",
    fontSize: '18px',
    color: '#1A1916',
  },
  brandAlura: {
    fontFamily: "'DM Serif Display', serif",
    fontSize: '13px',
    color: '#6B6860',
    fontStyle: 'italic',
  },
  meta: {
    fontSize: '11px',
    color: '#A8A59E',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },
  tabs: {
    display: 'flex',
    gap: '2px',
    flex: 1,
    overflowX: 'auto',
  },
  tab: {
    background: 'transparent',
    border: 'none',
    padding: '6px 12px',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '12px',
    fontWeight: '400',
    color: '#6B6860',
    cursor: 'pointer',
    borderRadius: '6px',
    whiteSpace: 'nowrap',
    transition: 'background 0.15s, color 0.15s',
  },
  tabActive: {
    background: '#1A1916',
    color: '#fff',
    fontWeight: '500',
  },
  filterWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    flexShrink: 0,
  },
  filterLabel: {
    fontSize: '10px',
    color: '#A8A59E',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  select: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '12px',
    padding: '5px 8px',
    borderRadius: '7px',
    border: '1px solid #C8C4B8',
    background: '#F7F6F1',
    color: '#1A1916',
    cursor: 'pointer',
  },
  actionBtn: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '12px',
    padding: '6px 12px',
    borderRadius: '6px',
    border: '1px solid #C8C4B8',
    background: 'transparent',
    color: '#6B6860',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },
  dropdown: {
    position: 'absolute',
    top: '38px',
    right: 0,
    background: '#fff',
    border: '1px solid #E0DDD4',
    borderRadius: '10px',
    padding: '6px',
    minWidth: '180px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
    zIndex: 200,
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  dropItem: {
    background: 'transparent',
    border: 'none',
    padding: '8px 10px',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '13px',
    color: '#1A1916',
    cursor: 'pointer',
    borderRadius: '6px',
    textAlign: 'left',
  },
  dropMeta: {
    fontSize: '11px',
    color: '#A8A59E',
    padding: '4px 10px',
  },
  dropDivider: {
    border: 'none',
    borderTop: '1px solid #E0DDD4',
    margin: '4px 0',
  },
};
