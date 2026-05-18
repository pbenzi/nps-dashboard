// ─────────────────────────────────────────────
// components/LoginScreen.jsx
// ─────────────────────────────────────────────
import { useState } from 'react';

export default function LoginScreen({ onLogin }) {
  const [user,     setUser]     = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTimeout(() => {
      const result = onLogin(user.trim(), password);
      if (!result.ok) setError(result.error);
      setLoading(false);
    }, 400);
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        {/* Logo / Brand */}
        <div style={styles.brand}>
          <span style={styles.brandNps}>NPS</span>
          <span style={styles.brandAlura}>Alura B2C</span>
        </div>
        <p style={styles.subtitle}>Acesso restrito — entre com suas credenciais</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Usuário</label>
            <input
              style={styles.input}
              type="text"
              autoComplete="username"
              value={user}
              onChange={e => setUser(e.target.value)}
              placeholder="usuário"
              required
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Senha</label>
            <input
              style={styles.input}
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <button
            type="submit"
            style={{ ...styles.btn, opacity: loading ? 0.6 : 1 }}
            disabled={loading}
          >
            {loading ? 'Verificando...' : 'Entrar'}
          </button>
        </form>

        <p style={styles.note}>Os dados são processados localmente e não são compartilhados.</p>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: '100vh',
    background: '#F2F0E8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1.5rem',
    fontFamily: "'DM Sans', sans-serif",
  },
  card: {
    background: '#FFFFFF',
    border: '1px solid #E0DDD4',
    borderRadius: '16px',
    padding: '2.5rem 2rem',
    width: '100%',
    maxWidth: '380px',
    textAlign: 'center',
  },
  brand: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'center',
    gap: '8px',
    marginBottom: '0.5rem',
  },
  brandNps: {
    fontFamily: "'DM Serif Display', serif",
    fontSize: '32px',
    color: '#1A1916',
    letterSpacing: '-0.5px',
  },
  brandAlura: {
    fontFamily: "'DM Serif Display', serif",
    fontSize: '20px',
    color: '#6B6860',
    fontStyle: 'italic',
  },
  subtitle: {
    fontSize: '13px',
    color: '#A8A59E',
    marginBottom: '2rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    textAlign: 'left',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#6B6860',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  input: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '14px',
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #C8C4B8',
    background: '#F7F6F1',
    color: '#1A1916',
    outline: 'none',
  },
  error: {
    fontSize: '13px',
    color: '#9B2020',
    background: '#FDEAEA',
    border: '1px solid #F5B8B8',
    borderRadius: '8px',
    padding: '8px 12px',
    margin: '0',
  },
  btn: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '14px',
    fontWeight: '600',
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    background: '#1A1916',
    color: '#fff',
    cursor: 'pointer',
    marginTop: '0.5rem',
    transition: 'opacity 0.15s',
  },
  note: {
    fontSize: '11px',
    color: '#A8A59E',
    marginTop: '1.5rem',
  },
};
