import { useEffect, useState } from 'react';

export type UserType = {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
};

const useAuth = () => {
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login'; // redirect la login
  };

  return { user, logout };
};

export default useAuth;
