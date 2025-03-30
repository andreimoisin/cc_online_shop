import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/api';
import '../styles/login.scss'; // Reutilizăm stilul

const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    try {
      await API.post('/auth/register', {
        name,
        email,
        password,
        role: 'customer', // implicit client
      });

      setSuccessMsg('Cont creat cu succes! Redirecționare în câteva secunde...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Eroare la înregistrare';
      setErrorMsg(message);
    }
  };

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleRegister}>
        <h2>Înregistrare</h2>

        {errorMsg && <p className="error-msg">{errorMsg}</p>}
        {successMsg && <p className="success-msg">{successMsg}</p>}

        <label>Nume complet</label>
        <input
          type="text"
          placeholder="Ex: Maria Popescu"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

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

        <button type="submit">Creează cont</button>
        <p className="redirect">
          Ai deja cont? <a href="/login">Autentifică-te</a>
        </p>
      </form>
    </div>
  );
};

export default Register;
