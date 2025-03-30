import { useEffect, useState } from 'react';
import API from '../api/api';
import '../styles/home.scss';

type ProductType = {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  stock: number;
  category: string;
};

const Home = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await API.get('/products');
        setProducts(res.data);
      } catch (err) {
        console.error('Eroare la obținerea produselor:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = async (productId: string) => {
    try {
      await API.post('/cart/add', { productId, quantity: 1 });
      setSuccess('Produsul a fost adăugat în coș!');
      setTimeout(() => setSuccess(null), 2500);
    } catch (error) {
      console.error('Eroare la adăugare în coș:', error);
      setSuccess('Eroare la adăugarea în coș!');
      setTimeout(() => setSuccess(null), 2500);
    }
  };

  return (
    <div className="home-page">
      <h1 className="title">Produse</h1>

      {success && <p className="cart-msg">{success}</p>}

      {loading ? (
        <p>Se încarcă...</p>
      ) : products.length === 0 ? (
        <p>Nu există produse momentan.</p>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <div className="product-card" key={product._id}>
              <img src={product.image} alt={product.name} />
              <h3>{product.name}</h3>
              <p className="price">{product.price} RON</p>
              <p className="desc">{product.description}</p>
              <button onClick={() => handleAddToCart(product._id)}>
                Adaugă în coș
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
