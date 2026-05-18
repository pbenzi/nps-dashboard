// ─────────────────────────────────────────────
// components/tabs/PorPeriodo.jsx
// ─────────────────────────────────────────────
import {
  BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { calcNPS, pct, fmt, MOTIVO_KEYS, MOTIVO_PT, PERIODS } from '../../lib/nps';
import { Card, MetricGrid, Metric, TwoCol } from '../Primitives';

export default function PorPeriodo({ answered }) {
  const periodMetrics = PERIODS.map(p => {
    const rows = answered.filter(r => r._nps_period === p.key);
    const nps  = calcNPS(rows);
    const det  = rows.filter(r => r._cat_nps === 'Detractor').length;
    const neu  = rows.filter(r => r._cat_nps === 'Neutral').length;
    return { ...p, rows, nps, det, neu };
  });

  const distData = PERIODS.map(p => {
    const rows = answered.filter(r => r._nps_period === p.key);
    const n = rows.length || 1;
    return {
      name: p.label,
      'Promotores %': pct(rows.filter(r => r._cat_nps === 'Promoter').length, n),
      'Neutros %':    pct(rows.filter(r => r._cat_nps === 'Neutral').length, n),
      'Detratores %': pct(rows.filter(r => r._cat_nps === 'Detractor').length, n),
    };
  });

  const colors = ['#3B82C4', '#F0A030', '#E05050'];

  const motivoDetData = MOTIVO_KEYS.map(mk => {
    const entry = { name: MOTIVO_PT[mk] };
    PERIODS.forEach((p, i) => {
      entry[p.label] = answered.filter(r =>
        r._nps_period === p.key && r._cat_nps === 'Detractor' && r._reason === mk
      ).length;
    });
    return entry;
  });

  const motivoNeuData = MOTIVO_KEYS.map(mk => {
    const entry = { name: MOTIVO_PT[mk] };
    PERIODS.forEach((p, i) => {
      entry[p.label] = answered.filter(r =>
        r._nps_period === p.key && r._cat_nps === 'Neutral' && r._reason === mk
      ).length;
    });
    return entry;
  });

  return (
    <div>
      <MetricGrid>
        {periodMetrics.map(p => (
          <Metric
            key={p.key}
            label={p.label}
            value={p.nps ?? '—'}
            sub={`${fmt(p.rows.length)} resp · ${p.det} det. · ${p.neu} neu.`}
            colorClass={p.nps >= 85 ? 'green' : p.nps >= 75 ? 'amber' : 'red'}
          />
        ))}
      </MetricGrid>

      <TwoCol>
        <Card title="Distribuição por período">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={distData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#A8A59E' }} />
              <YAxis tickFormatter={v => `${v}%`} tick={{ fontSize: 11, fill: '#A8A59E' }} />
              <Tooltip formatter={v => `${v}%`} />
              <Bar dataKey="Promotores %" stackId="a" fill="#4A9E35" />
              <Bar dataKey="Neutros %"    stackId="a" fill="#F0A030" />
              <Bar dataKey="Detratores %" stackId="a" fill="#E05050" radius={[2,2,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Motivos dos detratores">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={motivoDetData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#A8A59E' }} />
              <YAxis tick={{ fontSize: 11, fill: '#A8A59E' }} />
              <Tooltip />
              {PERIODS.map((p, i) => (
                <Bar key={p.key} dataKey={p.label} fill={colors[i]} radius={i === PERIODS.length - 1 ? [2,2,0,0] : [0,0,0,0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </TwoCol>

      <Card title="Motivos dos neutros">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={motivoNeuData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#A8A59E' }} />
            <YAxis tick={{ fontSize: 11, fill: '#A8A59E' }} />
            <Tooltip />
            {PERIODS.map((p, i) => (
              <Bar key={p.key} dataKey={p.label} fill={colors[i]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
