// ─────────────────────────────────────────────
// components/tabs/Detratores.jsx
// ─────────────────────────────────────────────
import { useState, useMemo } from 'react';
import { pct, fmt, MOTIVO_PT, NIVEL_PT } from '../../lib/nps';
import { MetricGrid, Metric, Tag } from '../Primitives';

const PERIOD_LABEL = {
  '30-60':   'Onboarding',
  '180-210': 'Meio de Ciclo',
  '335-365': 'Fim de Ciclo',
};
const PERIOD_TAG = {
  '30-60':   'blue',
  '180-210': 'amber',
  '335-365': 'red',
};

export default function Detratores({ answered }) {
  const [fPeriodo, setFPeriodo] = useState('');
  const [fMotivo,  setFMotivo]  = useState('');
  const [fNivel,   setFNivel]   = useState('');
  const [fCat,     setFCat]     = useState('');
  const [fInativo, setFInativo] = useState('');

  const totalDet = answered.filter(r => r._cat_nps === 'Detractor').length;

  const allDet = useMemo(() =>
    answered.filter(r => r._cat_nps === 'Detractor' && r._comment && r._comment !== 'None'),
  [answered]);

  const filtered = useMemo(() =>
    allDet.filter(r =>
      (!fPeriodo || r._nps_period === fPeriodo) &&
      (!fMotivo  || r._reason    === fMotivo)   &&
      (!fNivel   || r._expertise === fNivel)    &&
      (!fCat     || r._cat       === fCat)      &&
      (!fInativo || r._completed_30d === 0)
    ),
  [allDet, fPeriodo, fMotivo, fNivel, fCat, fInativo]);

  const selStyle = {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '13px',
    padding: '7px 10px',
    borderRadius: '8px',
    border: '1px solid #C8C4B8',
    background: '#F7F6F1',
    color: '#1A1916',
    cursor: 'pointer',
  };

  return (
    <div>
      <MetricGrid>
        <Metric label="Total detratores" value={totalDet} sub="Sem filtro" colorClass="red" />
        <Metric label="Com comentários" value={allDet.length} sub={`${pct(allDet.length, totalDet)}% deixaram comentário`} />
        <Metric label="Exibindo" value={filtered.length} sub="Com os filtros ativos" />
      </MetricGrid>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '1.25rem' }}>
        <select style={selStyle} value={fPeriodo} onChange={e => setFPeriodo(e.target.value)}>
          <option value="">Todos os períodos</option>
          <option value="30-60">Onboarding (30–60)</option>
          <option value="180-210">Meio de Ciclo (180–210)</option>
          <option value="335-365">Fim de Ciclo (335–365)</option>
        </select>
        <select style={selStyle} value={fMotivo} onChange={e => setFMotivo(e.target.value)}>
          <option value="">Todos os motivos</option>
          <option value="COURSE_CONTENT">Conteúdo</option>
          <option value="TEACHING_METHODOLOGY">Metodologia</option>
          <option value="PLATAFORM_USABILITY">Plataforma</option>
          <option value="STUDENT_SUPPORT">Suporte ao aluno</option>
          <option value="OTHER">Outros</option>
        </select>
        <select style={selStyle} value={fNivel} onChange={e => setFNivel(e.target.value)}>
          <option value="">Todos os níveis</option>
          <option value="NOVICE">Novice</option>
          <option value="BEGINNER">Beginner</option>
          <option value="ADVANCED">Advanced</option>
        </select>
        <select style={selStyle} value={fCat} onChange={e => setFCat(e.target.value)}>
          <option value="">Todas as categorias</option>
          <option value="Primeira Compra">Primeira Compra</option>
          <option value="Renovação">Renovação</option>
          <option value="Reativação">Reativação</option>
        </select>
        <select style={selStyle} value={fInativo} onChange={e => setFInativo(e.target.value)}>
          <option value="">Todos</option>
          <option value="1">Inativos nos últimos 30d</option>
        </select>
        <span style={{ fontSize: '12px', color: '#A8A59E', marginLeft: 'auto' }}>
          {filtered.length} de {allDet.length} detratores
        </span>
      </div>

      {/* Cards */}
      {filtered.length === 0 ? (
        <p style={{ color: '#A8A59E', fontSize: '13px', padding: '1rem 0', fontFamily: "'DM Sans', sans-serif" }}>
          Nenhum resultado para este filtro.
        </p>
      ) : (
        filtered.map((r, i) => {
          const inativo30 = r._completed_30d === 0 && r._completed_lifetime > 5;
          return (
            <div key={i} style={cardStyle}>
              <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '8px' }}>
                <Tag variant="red">nota {isNaN(r._scale) ? '—' : r._scale}</Tag>
                {r._nps_period && (
                  <Tag variant={PERIOD_TAG[r._nps_period] || 'default'}>
                    {PERIOD_LABEL[r._nps_period] || r._nps_period}
                  </Tag>
                )}
                {r._reason && <Tag variant="purple">{MOTIVO_PT[r._reason] || r._reason}</Tag>}
                {r._plan  && <Tag>{r._plan}</Tag>}
                {r._cat   && <Tag>{r._cat}</Tag>}
                {r._expertise && <Tag>{NIVEL_PT[r._expertise] || r._expertise}</Tag>}
                <Tag>{r._completed_lifetime} cursos (lifetime)</Tag>
                <Tag variant={inativo30 ? 'red' : 'default'}>{r._completed_30d} cursos (30d)</Tag>
              </div>
              <div style={commentStyle}>"{r._comment}"</div>
            </div>
          );
        })
      )}
    </div>
  );
}

const cardStyle = {
  border: '1px solid #E0DDD4',
  borderRadius: '10px',
  padding: '1rem 1.25rem',
  marginBottom: '0.75rem',
  background: '#FFFFFF',
  fontFamily: "'DM Sans', sans-serif",
};
const commentStyle = {
  fontSize: '13px',
  color: '#6B6860',
  lineHeight: '1.6',
  fontStyle: 'italic',
};
