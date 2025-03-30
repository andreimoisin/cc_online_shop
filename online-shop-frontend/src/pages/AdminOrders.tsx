import { useEffect, useState } from 'react';
import API from '../api/api';
import '../styles/admin-orders.scss';

type OrderType = {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  } | string;
  products: {
    productId: {
      name: string;
      price: number;
    };
    quantity: number;
  }[];
  total: number;
  status: string;
  createdAt: string;
};

const AdminOrders = () => {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);


  const fetchOrders = async () => {
    try {
      const res = await API.get('/orders/all'); // doar pentru admin
      setOrders(res.data);
    } catch (err) {
      console.error('Eroare la obținerea comenzilor:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await API.put(`/orders/${orderId}`, { status: newStatus });

      // Actualizare locală
      const updated = orders.map((order) =>
        order._id === orderId ? { ...order, status: newStatus } : order
      );
      setOrders(updated);
      setToastMessage('Status actualizat!');
      setTimeout(() => setToastMessage(null), 3000);

    } catch (err) {
      console.error('Eroare la actualizarea statusului:', err);
      alert('Eroare la modificarea statusului comenzii.');
    }
  };

  return (
    <div className="admin-orders">
      <h1 className="title">📦 Comenzi plasate</h1>
      {toastMessage && <div className="toast">{toastMessage}</div>}


      {loading ? (
        <p>Se încarcă...</p>
      ) : orders.length === 0 ? (
        <p>Nu există comenzi momentan.</p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div className="order-card" key={order._id}>
              <div className="order-header">
                <strong>Comandă:</strong> #{order._id}
                <br />
                <strong>Client:</strong>{' '}
                {typeof order.userId === 'string'
                  ? order.userId
                  : `${order.userId.name} (${order.userId.email})`}
              </div>

              <div className="order-body">
                {order.products.map((item, index) => (
                  <p key={index}>
                    {item.quantity} x {item.productId.name} — {item.productId.price} RON
                  </p>
                ))}

                <p><strong>Total:</strong> {order.total} RON</p>

                <label>
                  <strong>Status:</strong>{' '}
                  <div className="status-section">
                    <span className={`status-badge ${order.status}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>

                    <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                    </select>
                    </div>

                </label>

                <p><strong>Data:</strong> {new Date(order.createdAt).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
