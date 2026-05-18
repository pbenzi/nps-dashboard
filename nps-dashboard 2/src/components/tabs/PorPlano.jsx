// ─────────────────────────────────────────────
// components/tabs/PorPlano.jsx
// ─────────────────────────────────────────────
import {
  BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Cell, ResponsiveContainer,
} from 'recharts';
import { calcNPS, pct, fmt, npsColor } from '../../lib/nps';
import { Card, MetricGrid, Metric, NPSBadge } from '../Primitives';

export default function PorPlano({ answered }) {
  // ── Por plano ────────────────────────────────
  const planMap = {};
  answered.forEach(r => {
    if (!planMap[r._plan]) planMap[r._plan] = [];
    planMap[r._plan].push(r);
  });
  const planList = Object.entries(planMap)
    .map(([name, rows]) => ({
      name,
      total: rows.length,
      p: rows.filter(r => r._cat_nps === 'Promoter').length,
      n: rows.filter(r => r._cat_nps === 'Neutral').length,
      d: rows.filter(r => r._cat_nps === 'Detractor').length,
      nps: calcNPS(rows),
    }))
    .sort((a, b) => b.nps - a.nps);

  // ── Por categoria ────────────────────────────
  const cats = ['Primeira Compra', 'Renovação', 'Reativação'];

  return (
    <div>
      <Card
        title="NPS por plano"
        subtitle="Ordenado do maior para o menor NPS. Planos com menos de 10 respondentes têm baixa significância estatística."
      >
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '12px' }}>
          {[
            { color: '#16A34A', label: 'NPS ≥ 90' },
            { color: '#2563EB', label: 'NPS 80–89' },
            { color: '#D97706', label: 'NPS 70–79' },
            { color: '#DC2626', label: 'NPS < 70' },
          ].map(l => (
            <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#6B6860' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: l.color }} />
              {l.label}
            </div>
          ))}
        </div>
        <ResponsiveContainer width="100%" height={Math.max(320, planList.length * 26)}>
          <BarChart data={planList} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
            <XAxis type="number" domain={[40, 100]} tick={{ fontSize: 11, fill: '#A8A59E' }} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#A8A59E' }} width={160} />
            <Tooltip formatter={(v, _, props) => [`NPS ${props.payload.nps} · ${fmt(props.payload.total)} resp.`, '']} />
            <Bar dataKey="nps" radius={[0, 3, 3, 0]}>
              {planList.map((entry, i) => (
                <Cell key={i} fill={npsColor(entry.nps)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card title="NPS por categoria de licença">
        <MetricGrid>
          {cats.map(c => {
            const rows = answered.filter(r => r._cat === c);
            const nps  = calcNPS(rows);
            return (
              <Metric
                key={c}
                label={c}
                value={nps ?? '—'}
                sub={`${fmt(rows.length)} respondentes`}
                colorClass={nps >= 85 ? 'green' : nps >= 75 ? 'amber' : 'red'}
              />
            );
          })}
        </MetricGrid>
      </Card>

      <Card title="Tabela por plano">
        <div style={{ overflowX: 'auto' }}>
          <table style={tblStyle}>
            <thead>
              <tr>
                {['Plano', 'Respondentes', 'Promotores', 'Neutros', 'Detratores', 'NPS'].map(h => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {planList.map(p => (
                <tr key={p.name}>
                  <td style={tdStyle}>{p.name}</td>
                  <td style={tdStyle}>{fmt(p.total)}</td>
                  <td style={{ ...tdStyle, color: '#16A34A' }}>{fmt(p.p)} ({pct(p.p, p.total)}%)</td>
                  <td style={{ ...tdStyle, color: '#D97706' }}>{fmt(p.n)} ({pct(p.n, p.total)}%)</td>
                  <td style={{ ...tdStyle, color: '#DC2626' }}>{fmt(p.d)} ({pct(p.d, p.total)}%)</td>
                  <td style={tdStyle}><NPSBadge value={p.nps} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

const tblStyle = { width: '100%', borderCollapse: 'collapse', fontSize: '13px', fontFamily: "'DM Sans', sans-serif" };
const thStyle  = { textAlign: 'left', padding: '8px 10px', borderBottom: '1px solid #E0DDD4', fontSize: '11px', fontWeight: '600', color: '#A8A59E', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' };
const tdStyle  = { padding: '8px 10px', borderBottom: '1px solid #F7F6F1', color: '#1A1916' };
