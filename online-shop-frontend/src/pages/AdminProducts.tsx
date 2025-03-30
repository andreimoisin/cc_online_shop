import { useEffect, useState } from 'react';
import API from '../api/api';
import '../styles/admin-products.scss';

type ProductType = {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image: string;
};

const AdminProducts = () => {
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

  const handleChange = (id: string, field: string, value: string) => {
    const updated = products.map((p) =>
      p._id === id ? { ...p, [field]: field === 'price' || field === 'stock' ? Number(value) : value } : p
    );
    setProducts(updated);
  };

  const handleSave = async (id: string) => {
    const product = products.find((p) => p._id === id);
    if (!product) return;

    try {
      await API.put(`/products/${id}`, product);
      setSuccess('Produsul a fost actualizat!');
      setTimeout(() => setSuccess(null), 2000);
    } catch (err) {
      console.error('Eroare la actualizare produs:', err);
      alert('Eroare la salvare!');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Sigur vrei să ștergi acest produs?')) return;
  
    try {
      await API.delete(`/products/${id}`);
      setProducts(products.filter((p) => p._id !== id));
      setSuccess('Produsul a fost șters!');
      setTimeout(() => setSuccess(null), 2000);
    } catch (err) {
      console.error('Eroare la ștergerea produsului:', err);
      alert('Eroare la ștergere!');
    }
  };
  

  return (
    <div className="admin-products">
      <h1 className="title">📦 Administrare produse</h1>

      {success && <div className="success-msg">{success}</div>}

      {loading ? (
        <p>Se încarcă...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Nume</th>
              <th>Preț</th>
              <th>Stoc</th>
              <th>Categorie</th>
              <th>Imagine (link)</th>
              <th>Acțiune</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                <td>
                  <input
                    value={p.name}
                    onChange={(e) => handleChange(p._id, 'name', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={p.price}
                    onChange={(e) => handleChange(p._id, 'price', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={p.stock}
                    onChange={(e) => handleChange(p._id, 'stock', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    value={p.category}
                    onChange={(e) => handleChange(p._id, 'category', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    value={p.image}
                    onChange={(e) => handleChange(p._id, 'image', e.target.value)}
                  />
                </td>
                <td className="action-buttons">
                    <button onClick={() => handleSave(p._id)}>Salvează</button>
                    <button className="delete-btn" onClick={() => handleDelete(p._id)}>Șterge</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminProducts;
