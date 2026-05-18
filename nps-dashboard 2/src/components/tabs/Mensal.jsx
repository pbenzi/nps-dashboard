// ─────────────────────────────────────────────
// components/tabs/Mensal.jsx
// ─────────────────────────────────────────────
import {
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { calcNPS, pct, fmt, monthLabel, getMonths } from '../../lib/nps';
import { Card, Insight, NPSBadge } from '../Primitives';

const PERIOD_DEFS = [
  { key: 'total',   label: 'Total',                  color: '#1A1916' },
  { key: '30-60',   label: 'Onboarding (30–60)',      color: '#3B82C4' },
  { key: '180-210', label: 'Meio de Ciclo (180–210)', color: '#F0A030' },
  { key: '335-365', label: 'Fim de Ciclo (335–365)',  color: '#E05050' },
];

export default function Mensal({ answered }) {
  const months = getMonths(answered);

  const chartData = months.map(m => {
    const mRows = answered.filter(r => r._period_label === m);
    return {
      label: monthLabel(m),
      Total:         calcNPS(mRows),
      Onboarding:    calcNPS(mRows.filter(r => r._nps_period === '30-60')),
      'Meio de Ciclo': calcNPS(mRows.filter(r => r._nps_period === '180-210')),
      'Fim de Ciclo':  calcNPS(mRows.filter(r => r._nps_period === '335-365')),
    };
  });

  return (
    <div>
      <Insight type="neutral">
        Nos primeiros meses da base, todos os respondentes pertencem ao <strong>Onboarding (30–60 dias)</strong>.
        Os períodos de Meio de Ciclo e Fim de Ciclo surgem conforme os alunos completam 6 e 12 meses na plataforma.
      </Insight>

      <Card title="NPS por período — evolução mensal">
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '12px' }}>
          {[
            { color: '#1A1916', label: 'Total' },
            { color: '#3B82C4', label: 'Onboarding' },
            { color: '#F0A030', label: 'Meio de Ciclo' },
            { color: '#E05050', label: 'Fim de Ciclo' },
          ].map(l => (
            <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#6B6860' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: l.color }} />
              {l.label}
            </div>
          ))}
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#A8A59E' }} />
            <YAxis domain={[50, 100]} tick={{ fontSize: 11, fill: '#A8A59E' }} />
            <Tooltip formatter={(v, name) => [v ?? '—', name]} />
            <Line type="monotone" dataKey="Total"          stroke="#1A1916" strokeWidth={2} dot={{ r: 3 }} connectNulls={false} />
            <Line type="monotone" dataKey="Onboarding"     stroke="#3B82C4" strokeWidth={2} dot={{ r: 3 }} connectNulls={false} />
            <Line type="monotone" dataKey="Meio de Ciclo"  stroke="#F0A030" strokeWidth={2} dot={{ r: 3 }} strokeDasharray="4 3" connectNulls={false} />
            <Line type="monotone" dataKey="Fim de Ciclo"   stroke="#E05050" strokeWidth={2} dot={{ r: 3 }} strokeDasharray="4 3" connectNulls={false} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card title="Tabela completa">
        <div style={{ overflowX: 'auto' }}>
          <table style={tblStyle}>
            <thead>
              <tr>
                {['Mês', 'Período', 'Respondentes', 'Promotores', 'Neutros', 'Detratores', 'NPS'].map(h => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {months.map((m, mi) => {
                const gm = answered.filter(r => r._period_label === m);
                return PERIOD_DEFS.map((pd, pi) => {
                  const rows = pd.key === 'total' ? gm : gm.filter(r => r._nps_period === pd.key);
                  const n = rows.length;
                  const p2 = rows.filter(r => r._cat_nps === 'Promoter').length;
                  const ne = rows.filter(r => r._cat_nps === 'Neutral').length;
                  const d2 = rows.filter(r => r._cat_nps === 'Detractor').length;
                  const nps2 = calcNPS(rows);

                  if (!n && pd.key !== 'total') return (
                    <tr key={`${m}-${pd.key}`} style={{ opacity: 0.35 }}>
                      <td style={tdStyle}></td>
                      <td style={{ ...tdStyle, color: pd.color }}>{pd.label}</td>
                      <td style={tdStyle} colSpan={5}><span style={{ fontSize: '11px', color: '#A8A59E' }}>sem dados</span></td>
                    </tr>
                  );

                  return (
                    <tr key={`${m}-${pd.key}`} style={pd.key === 'total' ? { borderTop: '1.5px solid #E0DDD4' } : {}}>
                      <td style={{ ...tdStyle, fontWeight: pd.key === 'total' ? '600' : '400', paddingLeft: pd.key === 'total' ? '10px' : '1.5rem' }}>
                        {pd.key === 'total' ? monthLabel(m) : ''}
                      </td>
                      <td style={{ ...tdStyle, color: pd.color }}>{pd.label}</td>
                      <td style={tdStyle}>{fmt(n)}</td>
                      <td style={{ ...tdStyle, color: '#16A34A' }}>{fmt(p2)} ({pct(p2, n)}%)</td>
                      <td style={{ ...tdStyle, color: '#D97706' }}>{fmt(ne)} ({pct(ne, n)}%)</td>
                      <td style={{ ...tdStyle, color: '#DC2626' }}>{fmt(d2)} ({pct(d2, n)}%)</td>
                      <td style={tdStyle}><NPSBadge value={nps2} /></td>
                    </tr>
                  );
                });
              })}
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
