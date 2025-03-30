import { useState } from 'react';
import API from '../api/api';
import '../styles/add-product.scss';

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    stock: '',
    category: '',
    image: '',
  });

  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
  
    try {
      const payload = {
        name: formData.name,
        price: parseFloat(formData.price),
        description: formData.description,
        stock: parseInt(formData.stock),
        category: formData.category,
        image: formData.image,
      };
  
      await API.post('/products', payload);
      setSuccessMsg('Produs adăugat cu succes!');
      setFormData({
        name: '',
        price: '',
        description: '',
        stock: '',
        category: '',
        image: '',
      });
    } catch (error) {
      console.error('Eroare la adăugarea produsului:', error);
      setErrorMsg('Eroare la adăugare. Încearcă din nou.');
    }
  };
  

  return (
    <div className="add-product-page">
      <h1 className="title">➕ Adaugă Produs Nou</h1>

      <form className="add-product-form" onSubmit={handleSubmit}>
        {successMsg && <p className="success-msg">{successMsg}</p>}
        {errorMsg && <p className="error-msg">{errorMsg}</p>}

        <input
          type="text"
          name="name"
          placeholder="Nume produs"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Preț (RON)"
          value={formData.price}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="category"
          placeholder="Categorie"
          value={formData.category}
          onChange={handleChange}
        />
        <input
          type="number"
          name="stock"
          placeholder="Stoc"
          value={formData.stock}
          onChange={handleChange}
        />
        <textarea
          name="description"
          placeholder="Descriere"
          value={formData.description}
          onChange={handleChange}
        ></textarea>

        <input
          type="text"
          name="image"
          placeholder="Link imagine (ex: https://...)"
          value={formData.image}
          onChange={handleChange}
          required
        />

        <button type="submit">Adaugă Produs</button>
      </form>
    </div>
  );
};

export default AddProduct;
