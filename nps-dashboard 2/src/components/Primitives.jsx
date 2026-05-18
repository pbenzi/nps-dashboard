// ─────────────────────────────────────────────
// components/Primitives.jsx — Blocos reutilizáveis
// ─────────────────────────────────────────────

export function Card({ title, subtitle, children, style }) {
  return (
    <div style={{ ...cardStyles.card, ...style }}>
      {title && <div style={cardStyles.title}>{title}</div>}
      {subtitle && <div style={cardStyles.subtitle}>{subtitle}</div>}
      {children}
    </div>
  );
}

const cardStyles = {
  card: {
    background: '#FFFFFF',
    border: '1px solid #E0DDD4',
    borderRadius: '12px',
    padding: '1.25rem 1.5rem',
    marginBottom: '1.25rem',
    fontFamily: "'DM Sans', sans-serif",
  },
  title: {
    fontFamily: "'DM Serif Display', serif",
    fontSize: '17px',
    color: '#1A1916',
    marginBottom: '0.75rem',
    lineHeight: '1.3',
  },
  subtitle: {
    fontSize: '12px',
    color: '#A8A59E',
    marginTop: '-0.5rem',
    marginBottom: '0.75rem',
  },
};

// ── Metric ─────────────────────────────────────
export function Metric({ label, value, sub, colorClass }) {
  const colorMap = {
    green: '#16A34A',
    amber: '#D97706',
    red:   '#DC2626',
    blue:  '#2563EB',
  };
  return (
    <div style={metricStyles.box}>
      <div style={metricStyles.lbl}>{label}</div>
      <div style={{ ...metricStyles.val, color: colorMap[colorClass] || '#1A1916' }}>{value}</div>
      {sub && <div style={metricStyles.sub}>{sub}</div>}
    </div>
  );
}

const metricStyles = {
  box: {
    background: '#F7F6F1',
    border: '1px solid #E0DDD4',
    borderRadius: '10px',
    padding: '1rem 1.25rem',
  },
  lbl: {
    fontSize: '11px',
    color: '#A8A59E',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '4px',
  },
  val: {
    fontFamily: "'DM Serif Display', serif",
    fontSize: '26px',
    lineHeight: '1.1',
  },
  sub: {
    fontSize: '11px',
    color: '#A8A59E',
    marginTop: '4px',
  },
};

// ── MetricGrid ─────────────────────────────────
export function MetricGrid({ children }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: '10px',
      marginBottom: '1.25rem',
    }}>
      {children}
    </div>
  );
}

// ── Insight ─────────────────────────────────────
export function Insight({ type = 'neutral', children }) {
  const map = {
    neutral: { bg: '#F7F6F1', border: '#E0DDD4', color: '#6B6860' },
    warning: { bg: '#FDF3E3', border: '#F5D9A8', color: '#8B5000' },
    danger:  { bg: '#FDEAEA', border: '#F5B8B8', color: '#9B2020' },
    ok:      { bg: '#EAF3E6', border: '#B8DBA8', color: '#2D6A1F' },
  };
  const s = map[type] || map.neutral;
  return (
    <div style={{
      borderRadius: '10px',
      padding: '0.875rem 1.125rem',
      marginBottom: '0.75rem',
      fontSize: '13px',
      lineHeight: '1.6',
      border: `1px solid ${s.border}`,
      background: s.bg,
      color: s.color,
      fontFamily: "'DM Sans', sans-serif",
    }}>
      {children}
    </div>
  );
}

// ── TwoCol ──────────────────────────────────────
export function TwoCol({ children }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      gap: '1.25rem',
      marginBottom: '1.25rem',
    }}>
      {children}
    </div>
  );
}

// ── DataTable ───────────────────────────────────
export function DataTable({ headers, rows }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={tableStyles.tbl}>
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i} style={tableStyles.th}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => (
                <td key={ci} style={tableStyles.td}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const tableStyles = {
  tbl: { width: '100%', borderCollapse: 'collapse', fontSize: '13px', fontFamily: "'DM Sans', sans-serif" },
  th: {
    textAlign: 'left',
    padding: '8px 10px',
    borderBottom: '1px solid #E0DDD4',
    fontSize: '11px',
    fontWeight: '600',
    color: '#A8A59E',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    whiteSpace: 'nowrap',
  },
  td: {
    padding: '9px 10px',
    borderBottom: '1px solid #F7F6F1',
    color: '#1A1916',
    verticalAlign: 'middle',
  },
};

// ── NPS Badge ───────────────────────────────────
export function NPSBadge({ value }) {
  const color = value >= 85 ? '#16A34A' : value >= 75 ? '#D97706' : '#DC2626';
  return (
    <strong style={{ color }}>{value ?? '—'}</strong>
  );
}

// ── Tag ─────────────────────────────────────────
export function Tag({ variant = 'default', children }) {
  const variants = {
    default: { bg: '#F7F6F1', border: '#E0DDD4', color: '#6B6860' },
    red:     { bg: '#FDEAEA', border: '#F5B8B8', color: '#9B2020' },
    blue:    { bg: '#EBF3FB', border: '#B8D4EE', color: '#1A5FA0' },
    amber:   { bg: '#FDF3E3', border: '#F5D9A8', color: '#8B5000' },
    purple:  { bg: '#EFEEFC', border: '#CCCAF5', color: '#4B45B0' },
  };
  const s = variants[variant] || variants.default;
  return (
    <span style={{
      display: 'inline-block',
      fontSize: '11px',
      padding: '2px 8px',
      borderRadius: '20px',
      border: `1px solid ${s.border}`,
      background: s.bg,
      color: s.color,
    }}>
      {children}
    </span>
  );
}

// ── Loading / Error states ───────────────────────
export function LoadingState({ message = 'Carregando...' }) {
  return (
    <div style={{ textAlign: 'center', padding: '4rem', color: '#A8A59E', fontFamily: "'DM Sans', sans-serif" }}>
      <div style={spinnerStyle} />
      <p style={{ marginTop: '1rem', fontSize: '13px' }}>{message}</p>
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div style={{ textAlign: 'center', padding: '4rem', fontFamily: "'DM Sans', sans-serif" }}>
      <p style={{ color: '#9B2020', fontSize: '14px', marginBottom: '1rem' }}>{message}</p>
      {onRetry && (
        <button onClick={onRetry} style={{
          padding: '8px 16px', borderRadius: '8px', border: '1px solid #C8C4B8',
          background: '#fff', cursor: 'pointer', fontSize: '13px',
        }}>
          Tentar novamente
        </button>
      )}
    </div>
  );
}

const spinnerStyle = {
  width: '32px', height: '32px',
  border: '3px solid #E0DDD4',
  borderTopColor: '#1A1916',
  borderRadius: '50%',
  animation: 'spin 0.7s linear infinite',
  margin: '0 auto',
};
