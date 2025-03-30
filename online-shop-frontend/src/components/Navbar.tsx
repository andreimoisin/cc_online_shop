import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/navbar.scss';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/">🛒 Shop</Link>
      </div>

      <div className="nav-right">
        {user ? (
          <>
            {user.role === 'admin' && (
                <>
                    <Link to="/admin">Comenzi</Link>
                    <Link to="/admin/users">Utilizatori</Link>
                    <Link to="/admin/products/add">Adauga produse</Link>
                    <Link to="/admin/products">Management produse</Link>
                </>
            )}

            <Link to="/cart">Cart</Link>
            <span className="username">👤 {user.name}</span>
            <button className="logout-btn" onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
