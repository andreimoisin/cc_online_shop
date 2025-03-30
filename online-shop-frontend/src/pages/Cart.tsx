import { useEffect, useState } from 'react';
import API from '../api/api';
import '../styles/cart.scss';

type CartProduct = {
  productId: {
    _id: string;
    name: string;
    image: string;
    price: number;
    description: string;
  };
  quantity: number;
};

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const res = await API.get('/cart');
      setCartItems(res.data.products);
    } catch (err) {
      console.error('Eroare la obținerea coșului:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity < 1) return;
    try {
      await API.put('/cart/update', { productId, quantity });
      fetchCart(); // reîncarcă coșul după update
    } catch (err) {
      console.error('Eroare la actualizarea cantității:', err);
    }
  };

  const removeItem = async (productId: string) => {
    try {
      await API.post('/cart/remove', { productId });
      fetchCart();
    } catch (err) {
      console.error('Eroare la ștergerea produsului:', err);
    }
  };

  const clearCart = async () => {
    try {
      await API.post('/cart/clear');
      fetchCart();
    } catch (err) {
      console.error('Eroare la golirea coșului:', err);
    }
  };

  const placeOrder = async () => {
    try {
      await API.post('/orders'); // fără body
  
      setCartItems([]); // goli coșul local
      alert('Comanda a fost plasată cu succes!');
    } catch (err) {
      console.error('Eroare la plasarea comenzii:', err);
      alert('A apărut o eroare la plasarea comenzii.');
    }
  };
  

  const getTotal = () =>
    cartItems.reduce((acc, item) => acc + item.productId.price * item.quantity, 0);

  return (
    <div className="cart-page">
      <h1 className="title">🛒 Coșul tău</h1>

      {loading ? (
        <p>Se încarcă...</p>
      ) : cartItems.length === 0 ? (
        <p>Coșul este gol.</p>
      ) : (
        <>
          <div className="cart-container">
            {cartItems.map((item) => (
              <div className="cart-item" key={item.productId._id}>
                <img src={item.productId.image} alt={item.productId.name} />
                <div className="info">
                  <h3>{item.productId.name}</h3>
                  <p>{item.productId.description}</p>
                  <p className="price">{item.productId.price} RON</p>

                  <div className="quantity">
                    <button onClick={() => updateQuantity(item.productId._id, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.productId._id, item.quantity + 1)}>+</button>
                  </div>

                  <button className="remove-btn" onClick={() => removeItem(item.productId._id)}>
                    Șterge produs
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-total">
            <h3>Total: {getTotal()} RON</h3>
            <button className="checkout-btn" onClick={placeOrder}>Plasează comanda</button>
            <button className="clear-btn" onClick={clearCart}>Golește coșul</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
