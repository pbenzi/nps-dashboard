// ─────────────────────────────────────────────
// lib/nps.js — Parsing e cálculos NPS
// ─────────────────────────────────────────────

export const MOTIVO_PT = {
  COURSE_CONTENT: 'Conteúdo',
  TEACHING_METHODOLOGY: 'Metodologia',
  PLATAFORM_USABILITY: 'Plataforma',
  STUDENT_SUPPORT: 'Suporte ao aluno',
  FORUM_AND_DISCORD_ALURA: 'Fórum/Discord',
  OTHER: 'Outros',
};

export const NIVEL_PT = {
  NOVICE: 'Novice',
  BEGINNER: 'Beginner',
  ADVANCED: 'Advanced',
};

export const PERIOD_LABEL = {
  '30-60': 'Onboarding',
  '180-210': 'Meio de Ciclo',
  '335-365': 'Fim de Ciclo',
};

// ── Parse survey_date → { year, month } ──────
function parseSurveyDate(sd) {
  if (!sd) return { year: 0, month: 0 };
  const s = sd.trim();
  const m1 = s.match(/^(\d{4})[-/](\d{1,2})/);
  const m2 = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  const m3 = s.match(/^(\d{1,2})\/(\d{4})$/);
  if (m1) return { year: +m1[1], month: +m1[2] };
  if (m2) return { year: +m2[3], month: +m2[2] };
  if (m3) return { year: +m3[2], month: +m3[1] };
  return { year: 0, month: 0 };
}

// ── Enriches raw row ──────────────────────────
export function enrichRow(r) {
  const { year: sy, month: sm } = parseSurveyDate(r['survey_date']);
  const year  = sy  || parseInt(r['year'])  || 0;
  const month = sm  || parseInt(r['month']) || 0;

  return {
    ...r,
    _completed_lifetime: parseFloat(r['eng.total_courses_completed_lifetime']) || 0,
    _completed_30d:      parseFloat(r['eng.total_courses_completed_last_30d'])  || 0,
    _scale:              parseFloat(r['recommendScale']),
    _year:               year,
    _month:              month,
    _period_label:       `${year}-${String(month).padStart(2, '0')}`,
    _expertise:          (r['raw_onboarding.expertise_level'] || '').trim().toUpperCase(),
    _plan:               r['bq_licence.current_plan_name'] || '',
    _cat:                r['bq_licence.category_current_license'] || '',
    _nps_period:         r['nps_answer_period'] || '',
    _reason:             r['npsReasonType'] || '',
    _comment:            (r['describeReason'] || '').trim(),
    _cat_nps:            r['nps_category'] || '',
  };
}

// ── NPS calculation ───────────────────────────
export function calcNPS(rows) {
  if (!rows.length) return null;
  const p = rows.filter(r => r._cat_nps === 'Promoter').length;
  const d = rows.filter(r => r._cat_nps === 'Detractor').length;
  return Math.round(((p - d) / rows.length) * 1000) / 10;
}

export function pct(n, total) {
  return total ? Math.round((n / total) * 100) : 0;
}

export function fmt(n) {
  return (n || 0).toLocaleString('pt-BR');
}

export function npsColor(v) {
  if (v === null || v === undefined) return '#9CA3AF';
  if (v >= 90) return '#16A34A';
  if (v >= 80) return '#2563EB';
  if (v >= 70) return '#D97706';
  return '#DC2626';
}

export function npsColorClass(v) {
  if (v === null || v === undefined) return 'text-gray-400';
  if (v >= 85) return 'text-green-600';
  if (v >= 75) return 'text-amber-600';
  return 'text-red-600';
}

// ── Month label ───────────────────────────────
const MONTH_NAMES = ['','jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];

export function monthLabel(periodLabel) {
  const [y, mo] = periodLabel.split('-');
  return `${MONTH_NAMES[+mo]}/${y.slice(2)}`;
}

// ── Derive sorted months from answered rows ───
export function getMonths(answered) {
  return [...new Set(answered.map(r => r._period_label))].sort();
}

// ── Filter by period_label ────────────────────
export function filterByMonth(rows, month) {
  if (!month) return rows;
  return rows.filter(r => r._period_label === month);
}

// ── MOTIVO_KEYS ───────────────────────────────
export const MOTIVO_KEYS = [
  'COURSE_CONTENT',
  'TEACHING_METHODOLOGY',
  'PLATAFORM_USABILITY',
  'STUDENT_SUPPORT',
  'OTHER',
];

export const PERIODS = [
  { key: '30-60',   label: 'Onboarding',    short: 'Onb.' },
  { key: '180-210', label: 'Meio de Ciclo', short: 'MeC.' },
  { key: '335-365', label: 'Fim de Ciclo',  short: 'FdC.' },
];
