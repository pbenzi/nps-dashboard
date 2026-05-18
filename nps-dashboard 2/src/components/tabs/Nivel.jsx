// ─────────────────────────────────────────────
// components/tabs/Nivel.jsx
// ─────────────────────────────────────────────
import {
  BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Cell, Legend, ResponsiveContainer,
} from 'recharts';
import { calcNPS, fmt, npsColor, NIVEL_PT, PERIODS } from '../../lib/nps';
import { Card, MetricGrid, Metric, Insight, TwoCol } from '../Primitives';

const LEVELS    = ['NOVICE', 'BEGINNER', 'ADVANCED'];
const LVL_COLORS = ['#3B82C4', '#F0A030', '#E05050'];

export default function Nivel({ answered }) {
  const levelData = LEVELS.map((l, i) => {
    const rows       = answered.filter(r => r._expertise === l);
    const det        = rows.filter(r => r._cat_nps === 'Detractor');
    const detContent = det.filter(r => r._reason === 'COURSE_CONTENT').length;
    const pctContent = det.length ? Math.round((detContent / det.length) * 100) : 0;
    return {
      key: l,
      label: NIVEL_PT[l],
      rows,
      nps: calcNPS(rows),
      det: det.length,
      detContent,
      pctContent,
      color: LVL_COLORS[i],
    };
  });

  const adv    = levelData.find(l => l.label === 'Advanced');
  const novice = levelData.find(l => l.label === 'Novice');

  const npsData   = levelData.map(l => ({ name: l.label, nps: l.nps }));
  const contentData = levelData.map(l => ({ name: l.label, '%': l.pctContent }));

  // nível × período
  const nivelPeriodoData = PERIODS.map(p => {
    const entry = { name: p.label };
    levelData.forEach(l => {
      entry[l.label] = calcNPS(answered.filter(r => r._expertise === l.key && r._nps_period === p.key));
    });
    return entry;
  });

  return (
    <div>
      <MetricGrid>
        {levelData.map(l => (
          <Metric
            key={l.key}
            label={l.label}
            value={l.nps ?? '—'}
            sub={`${fmt(l.rows.length)} respondentes · ${l.det} detratores`}
            colorClass={l.nps >= 85 ? 'green' : l.nps >= 75 ? 'amber' : 'red'}
          />
        ))}
      </MetricGrid>

      <Insight type="warning">
        <strong>Hipótese confirmada.</strong> O aluno Advanced tem o menor NPS ({adv?.nps ?? '—'}) e{' '}
        {adv?.pctContent ?? 0}% dos detratores nesse grupo reclamam especificamente de conteúdo — contra{' '}
        {novice?.pctContent ?? 0}% dos Novice. São os alunos que mais conhecem a plataforma e estão
        pedindo maior profundidade.
      </Insight>

      <TwoCol>
        <Card title="NPS por nível de experiência">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={npsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#A8A59E' }} />
              <YAxis domain={[60, 100]} tick={{ fontSize: 11, fill: '#A8A59E' }} />
              <Tooltip formatter={v => [`NPS ${v}`, '']} />
              <Bar dataKey="nps" radius={[3,3,0,0]}>
                {levelData.map((l, i) => <Cell key={i} fill={l.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="% de detratores que reclamam de conteúdo">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={contentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#A8A59E' }} />
              <YAxis tickFormatter={v => `${v}%`} tick={{ fontSize: 11, fill: '#A8A59E' }} />
              <Tooltip formatter={v => [`${v}%`, '']} />
              <Bar dataKey="%" radius={[3,3,0,0]}>
                {levelData.map((l, i) => <Cell key={i} fill={l.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </TwoCol>

      <Card title="Nível do aluno × período do ciclo" subtitle="NPS de cada combinação de nível e momento da jornada">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={nivelPeriodoData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#A8A59E' }} />
            <YAxis domain={[60, 100]} tick={{ fontSize: 11, fill: '#A8A59E' }} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: '12px', color: '#6B6860' }} />
            {levelData.map((l, i) => (
              <Bar key={l.key} dataKey={l.label} fill={l.color} radius={[2,2,0,0]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
