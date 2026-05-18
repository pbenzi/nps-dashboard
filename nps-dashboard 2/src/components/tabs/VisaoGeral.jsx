// ─────────────────────────────────────────────
// components/tabs/VisaoGeral.jsx
// ─────────────────────────────────────────────
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell,
} from 'recharts';
import { calcNPS, pct, fmt, npsColor, monthLabel, getMonths } from '../../lib/nps';
import { Card, MetricGrid, Metric, Insight, TwoCol } from '../Primitives';

export default function VisaoGeral({ all, answered }) {
  const total  = all.length;
  const didnt  = all.filter(r => r._cat_nps === "Didn't answer").length;
  const resp   = answered.length;
  const prom   = answered.filter(r => r._cat_nps === 'Promoter').length;
  const neu    = answered.filter(r => r._cat_nps === 'Neutral').length;
  const det    = answered.filter(r => r._cat_nps === 'Detractor').length;
  const nps    = calcNPS(answered);

  const months = getMonths(answered);
  const monthlyData = months.map(m => {
    const mRows = answered.filter(r => r._period_label === m);
    return {
      label: monthLabel(m),
      nps: calcNPS(mRows),
      Promotores: mRows.filter(r => r._cat_nps === 'Promoter').length,
      Neutros:    mRows.filter(r => r._cat_nps === 'Neutral').length,
      Detratores: mRows.filter(r => r._cat_nps === 'Detractor').length,
    };
  });

  const npsColorClass = nps >= 85 ? 'green' : nps >= 75 ? 'amber' : 'red';

  return (
    <div>
      <MetricGrid>
        <Metric label="NPS Geral" value={nps ?? '—'} sub="Período completo" colorClass={npsColorClass} />
        <Metric label="Total registros" value={fmt(total)} sub="Pesquisas disparadas" />
        <Metric label="Respondentes" value={fmt(resp)} sub={`${pct(resp, total)}% do total`} />
        <Metric label="Não responderam" value={fmt(didnt)} sub={`${pct(didnt, total)}% do total`} />
        <Metric label="Promotores" value={fmt(prom)} sub={`${pct(prom, resp)}% dos respondentes`} colorClass="green" />
        <Metric label="Neutros" value={fmt(neu)} sub={`${pct(neu, resp)}% dos respondentes`} colorClass="amber" />
        <Metric label="Detratores" value={fmt(det)} sub={`${pct(det, resp)}% dos respondentes`} colorClass="red" />
      </MetricGrid>

      <TwoCol>
        <Card title="NPS mensal">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#A8A59E' }} />
              <YAxis domain={[50, 100]} tick={{ fontSize: 11, fill: '#A8A59E' }} />
              <Tooltip formatter={(v) => [`NPS ${v}`, '']} />
              <Line type="monotone" dataKey="nps" stroke="#1A1916" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Respondentes por mês">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#A8A59E' }} />
              <YAxis tick={{ fontSize: 11, fill: '#A8A59E' }} />
              <Tooltip />
              <Bar dataKey="Promotores" stackId="a" fill="#4A9E35" radius={[0,0,0,0]} />
              <Bar dataKey="Neutros"    stackId="a" fill="#F0A030" />
              <Bar dataKey="Detratores" stackId="a" fill="#E05050" radius={[2,2,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </TwoCol>

      <Card title="Distribuição geral">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={[{ name: 'Total', Promotores: prom, Neutros: neu, Detratores: det }]} layout="vertical">
            <XAxis type="number" tick={{ fontSize: 11, fill: '#A8A59E' }} />
            <YAxis type="category" dataKey="name" hide />
            <Tooltip />
            <Bar dataKey="Promotores" stackId="a" fill="#4A9E35" radius={[0,0,0,0]} />
            <Bar dataKey="Neutros"    stackId="a" fill="#F0A030" />
            <Bar dataKey="Detratores" stackId="a" fill="#E05050" radius={[0,4,4,0]} />
            <Legend />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Insight type="neutral">
        <strong>Nota sobre mudança de percepção:</strong> cada user_id aparece uma única vez no dataset.
        Não há histórico longitudinal por aluno — a análise de alunos que "viraram detratores" requer
        cruzamento com bases históricas de NPS anteriores.
      </Insight>
    </div>
  );
}
