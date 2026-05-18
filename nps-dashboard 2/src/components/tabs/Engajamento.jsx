// ─────────────────────────────────────────────
// components/tabs/Engajamento.jsx
// ─────────────────────────────────────────────
import {
  BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Cell, ResponsiveContainer,
} from 'recharts';
import { calcNPS, fmt, npsColor, MOTIVO_KEYS, MOTIVO_PT } from '../../lib/nps';
import { Card, MetricGrid, Metric, Insight, TwoCol } from '../Primitives';

const BUCKETS = [
  { lo: 0,  hi: 0,    label: '0 cursos' },
  { lo: 1,  hi: 1,    label: '1 curso' },
  { lo: 2,  hi: 5,    label: '2–5 cursos' },
  { lo: 6,  hi: 20,   label: '6–20 cursos' },
  { lo: 21, hi: 9999, label: '+20 cursos' },
];
const BUCKETS_30 = [
  { lo: 0, hi: 0,    label: '0 (inativo)' },
  { lo: 1, hi: 1,    label: '1 curso' },
  { lo: 2, hi: 5,    label: '2–5 cursos' },
  { lo: 6, hi: 9999, label: '+6 cursos' },
];

export default function Engajamento({ answered }) {
  const lifetimeNPS = BUCKETS.map(b => ({
    name: b.label,
    nps: calcNPS(answered.filter(r => r._completed_lifetime >= b.lo && r._completed_lifetime <= b.hi)),
  }));
  const lifetime30NPS = BUCKETS_30.map(b => ({
    name: b.label,
    nps: calcNPS(answered.filter(r => r._completed_30d >= b.lo && r._completed_30d <= b.hi)),
  }));

  const detContentAll = answered.filter(r => r._cat_nps === 'Detractor' && r._reason === 'COURSE_CONTENT');
  const avgLifetime   = detContentAll.length
    ? (detContentAll.reduce((a, r) => a + r._completed_lifetime, 0) / detContentAll.length).toFixed(1)
    : 0;

  const detInativos = answered.filter(r =>
    r._cat_nps === 'Detractor' && r._completed_30d === 0 && r._completed_lifetime > 5
  );
  const avgDetInativo = detInativos.length
    ? (detInativos.reduce((a, r) => a + r._completed_lifetime, 0) / detInativos.length).toFixed(0)
    : 0;

  const inatMotivoData = MOTIVO_KEYS.map(mk => ({
    name: MOTIVO_PT[mk],
    Detratores: detInativos.filter(r => r._reason === mk).length,
  }));

  return (
    <div>
      <MetricGrid>
        <Metric label="NPS — 0 cursos" value={lifetimeNPS[0].nps ?? '—'} sub={`bucket inicial`} colorClass={lifetimeNPS[0].nps >= 85 ? 'green' : lifetimeNPS[0].nps >= 75 ? 'amber' : 'red'} />
        <Metric label="NPS — 1 curso" value={lifetimeNPS[1].nps ?? '—'} sub="maior risco" colorClass="red" />
        <Metric label="NPS — 6 a 20 cursos" value={lifetimeNPS[3].nps ?? '—'} sub="melhor NPS" colorClass="green" />
        <Metric label="NPS — +20 cursos" value={lifetimeNPS[4].nps ?? '—'} sub="alunos avançados" colorClass={lifetimeNPS[4].nps >= 85 ? 'green' : 'amber'} />
        <Metric label="Det. inativos (>5 cursos)" value={detInativos.length} sub={`Média de ${avgDetInativo} cursos lifetime`} colorClass="red" />
      </MetricGrid>

      <Insight type="warning">
        <strong>Alunos com exatamente 1 curso concluído têm o pior NPS do grupo ({lifetimeNPS[1].nps ?? '—'}).</strong>{' '}
        É o momento de maior risco de abandono — o aluno terminou o primeiro conteúdo e ainda não consolidou o hábito de estudo.
      </Insight>
      <Insight type="warning">
        <strong>Detratores que reclamam de conteúdo têm em média {avgLifetime} cursos concluídos (lifetime).</strong>{' '}
        Os alunos mais experientes estão pedindo maior profundidade — não mais quantidade.
      </Insight>

      <TwoCol>
        <Card title="NPS por cursos concluídos (lifetime)">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={lifetimeNPS}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#A8A59E' }} />
              <YAxis domain={[60, 100]} tick={{ fontSize: 11, fill: '#A8A59E' }} />
              <Tooltip formatter={v => [`NPS ${v}`, '']} />
              <Bar dataKey="nps" radius={[3,3,0,0]}>
                {lifetimeNPS.map((e, i) => <Cell key={i} fill={npsColor(e.nps)} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="NPS por atividade recente (últimos 30 dias)">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={lifetime30NPS}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#A8A59E' }} />
              <YAxis domain={[60, 100]} tick={{ fontSize: 11, fill: '#A8A59E' }} />
              <Tooltip formatter={v => [`NPS ${v}`, '']} />
              <Bar dataKey="nps" radius={[3,3,0,0]}>
                {lifetime30NPS.map((e, i) => <Cell key={i} fill={npsColor(e.nps)} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </TwoCol>

      <Card
        title="Detratores experientes e inativos"
        subtitle={`${detInativos.length} detratores com mais de 5 cursos concluídos ao longo da vida, mas nenhum nos últimos 30 dias. Média de ${avgDetInativo} cursos lifetime.`}
      >
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={inatMotivoData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#A8A59E' }} />
            <YAxis tick={{ fontSize: 11, fill: '#A8A59E' }} />
            <Tooltip />
            <Bar dataKey="Detratores" fill="#E05050" radius={[3,3,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
