import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/api';
import '../styles/login.scss';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      const res = await API.post('/auth/login', { email, password });

      // Salvăm token și user în localStorage
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      // Setăm userul în context pentru actualizare imediată
      setUser(res.data.user);

      // Redirecționăm utilizatorul
      navigate('/');
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Login eșuat';
      setErrorMsg(message);
    }
  };

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Autentificare</h2>

        {errorMsg && <p className="error-msg">{errorMsg}</p>}

        <label>Email</label>
        <input
          type="email"
          placeholder="email@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Parolă</label>
        <input
          type="password"
          placeholder="••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>
        <p className="redirect">
          Nu ai cont? <a href="/register">Înregistrează-te</a>
        </p>
      </form>
    </div>
  );
};

export default Login;
