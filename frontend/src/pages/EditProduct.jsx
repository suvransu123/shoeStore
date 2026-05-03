import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './ProductForm.css';

const CATEGORIES = ['Running', 'Casual', 'Formal', 'Sports', 'Boots', 'Sandals'];

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get(`/products/${id}`)
      .then(res => {
        const p = res.data.product;
        setForm({
          name: p.name, description: p.description, price: p.price,
          category: p.category, brand: p.brand, stock: p.stock,
          image: p.image || '', isFeatured: p.isFeatured,
          sizes: p.sizes?.join(', ') || '',
          colors: p.colors?.join(', ') || '',
        });
      })
      .catch(() => navigate('/'));
  }, [id]);

  const [imageFile, setImageFile] = useState(null);

  const handleChange = e => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') {
      setImageFile(files[0]);
    } else {
      setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(form).forEach(key => {
        if (key !== 'image') formData.append(key, form[key]);
      });

      // Process arrays
      const sizesArr = form.sizes.split(',').map(s => Number(s.trim())).filter(Boolean);
      const colorsArr = form.colors.split(',').map(c => c.trim()).filter(Boolean);

      formData.set('sizes', JSON.stringify(sizesArr));
      formData.set('colors', JSON.stringify(colorsArr));
      formData.set('price', Number(form.price));
      formData.set('stock', Number(form.stock));

      if (imageFile) {
        formData.append('image', imageFile);
      } else {
        formData.append('image', form.image); // Keep old image if no new file
      }

      await axios.put(`/products/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate(`/products/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  if (!form) return <div className="loading-center container"><div className="spinner" /></div>;

  return (
    <div className="page-content container">
      <div className="form-page-wrap">
        <div className="form-page-header">
          <button onClick={() => navigate(-1)} className="back-btn">← Back</button>
          <h1 className="heading-md">Edit Product</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Update the product details below</p>
        </div>

        {error && <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>{error}</div>}

        <form onSubmit={handleSubmit} className="product-form card">
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Product Name *</label>
              <input name="name" value={form.name} onChange={handleChange} className="form-input" required />
            </div>
            <div className="form-group">
              <label className="form-label">Brand *</label>
              <input name="brand" value={form.brand} onChange={handleChange} className="form-input" required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description *</label>
            <textarea name="description" value={form.description} onChange={handleChange} className="form-textarea" required />
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Price (₹) *</label>
              <input name="price" type="number" min="0" step="1" value={form.price} onChange={handleChange} className="form-input" required />
            </div>
            <div className="form-group">
              <label className="form-label">Stock *</label>
              <input name="stock" type="number" min="0" value={form.stock} onChange={handleChange} className="form-input" required />
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select name="category" value={form.category} onChange={handleChange} className="form-select">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Product Image (Leave blank to keep current)</label>
              <input 
                name="image" 
                type="file" 
                accept="image/*" 
                onChange={handleChange} 
                className="form-input" 
              />
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Sizes (comma separated)</label>
              <input name="sizes" value={form.sizes} onChange={handleChange} className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">Colors (comma separated)</label>
              <input name="colors" value={form.colors} onChange={handleChange} className="form-input" />
            </div>
          </div>

          <label className="featured-checkbox">
            <input name="isFeatured" type="checkbox" checked={form.isFeatured} onChange={handleChange} />
            <span>⭐ Mark as Featured Product</span>
          </label>

          <div className="form-actions">
            <button type="button" onClick={() => navigate(-1)} className="btn btn-secondary">Cancel</button>
            <button id="update-product-btn" type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <><div className="btn-spinner" />Updating...</> : '💾 Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
