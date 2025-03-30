import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Cart from './pages/Cart';
import Register from './pages/Register';
import AdminOrders from './pages/AdminOrders';
import AdminUsers from './pages/AdminUsers';
import './App.scss';
import AddProduct from './pages/AddProduct';
import AdminProducts from './pages/AdminProducts';


function App() {
  return (
    <Router>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<AdminOrders />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/products/add" element={<AddProduct />} />
          <Route path="/admin/products" element={<AdminProducts />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
