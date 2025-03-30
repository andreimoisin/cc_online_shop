import { useEffect, useState } from 'react';
import API from '../api/api';
import '../styles/admin-users.scss';

type UserType = {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'customer';
  createdAt: string;
};

const AdminUsers = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await API.get('/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Eroare la obținerea utilizatorilor:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await API.put(`/users/${userId}/role`, { role: newRole });
      const updated = users.map((user) =>
        user._id === userId ? { ...user, role: newRole as 'admin' | 'customer' } : user
      );
      setUsers(updated);
    } catch (err) {
      console.error('Eroare la schimbarea rolului:', err);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('Sigur vrei să ștergi acest utilizator?')) return;
    try {
      await API.delete(`/users/${userId}`);
      setUsers(users.filter((user) => user._id !== userId));
    } catch (err) {
      console.error('Eroare la ștergerea utilizatorului:', err);
    }
  };

  return (
    <div className="admin-users">
      <h1 className="title">👤 Management utilizatori</h1>

      {loading ? (
        <p>Se încarcă...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nume</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Creat la</th>
              <th>Acțiuni</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                  >
                    <option value="customer">Customer</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td>{new Date(user.createdAt).toLocaleString()}</td>
                <td>
                  <button className="delete-btn" onClick={() => handleDelete(user._id)}>
                    Șterge
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminUsers;