// ─────────────────────────────────────────────
// components/tabs/Risco.jsx
// ─────────────────────────────────────────────
import {
  BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Cell, ResponsiveContainer,
} from 'recharts';
import { pct, fmt } from '../../lib/nps';
import { Card, MetricGrid, Metric, Insight, TwoCol } from '../Primitives';

export default function Risco({ answered }) {
  const ob = answered.filter(r => r._nps_period === '30-60');
  const mc = answered.filter(r => r._nps_period === '180-210');
  const fc = answered.filter(r => r._nps_period === '335-365');

  const obDet = ob.filter(r => r._cat_nps === 'Detractor').length;
  const mcDet = mc.filter(r => r._cat_nps === 'Detractor').length;
  const mcNeu = mc.filter(r => r._cat_nps === 'Neutral').length;
  const fcDet = fc.filter(r => r._cat_nps === 'Detractor').length;
  const fcNeu = fc.filter(r => r._cat_nps === 'Neutral').length;
  const fcRisk = fcDet + fcNeu;

  const fcRiskRows = fc.filter(r => r._cat_nps === 'Detractor' || r._cat_nps === 'Neutral');

  // Por plano (top 8)
  const planRisk = {};
  fcRiskRows.forEach(r => { planRisk[r._plan] = (planRisk[r._plan] || 0) + 1; });
  const planRiskData = Object.entries(planRisk)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, value]) => ({ name, value }));

  const cats = ['Renovação', 'Primeira Compra', 'Reativação'];

  return (
    <div>
      <Insight type="ok">
        <strong>Onboarding (30–60 dias):</strong> {obDet} detratores ({pct(obDet, ob.length)}%).
        Janela de recuperação — o aluno ainda está explorando a plataforma. Ação rápida pode reverter
        a percepção antes que ela se consolide.
      </Insight>
      <Insight type="warning">
        <strong>Meio de Ciclo (180–210 dias):</strong> {mcDet} detratores ({pct(mcDet, mc.length)}%) +{' '}
        {mcNeu} neutros ({pct(mcNeu, mc.length)}%) ={' '}
        <strong>{mcDet + mcNeu} alunos em risco de não renovar</strong>.
        Ainda há tempo para ações de engajamento antes do fim do ciclo.
      </Insight>
      <Insight type="danger">
        <strong>Fim de Ciclo (335–365 dias):</strong> {fcDet} detratores ({pct(fcDet, fc.length)}%) +{' '}
        {fcNeu} neutros ({pct(fcNeu, fc.length)}%) ={' '}
        <strong>{fcRisk} alunos em risco de churn ({pct(fcRisk, fc.length)}%)</strong>.
        Identificar e acionar este grupo é urgente.
      </Insight>

      <TwoCol>
        <Card title="Alunos em risco — Fim de Ciclo por plano">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={planRiskData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#A8A59E' }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#A8A59E' }} width={150} />
              <Tooltip formatter={v => [`${v} alunos em risco`, '']} />
              <Bar dataKey="value" fill="#E05050" radius={[0, 3, 3, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Risco por categoria de licença">
          <MetricGrid>
            {cats.map(c => (
              <Metric
                key={c}
                label={c}
                value={fcRiskRows.filter(r => r._cat === c).length}
                sub="alunos em risco no fim de ciclo"
                colorClass="red"
              />
            ))}
          </MetricGrid>
        </Card>
      </TwoCol>
    </div>
  );
}
