import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ProductForm.css';

const CATEGORIES = ['Running', 'Casual', 'Formal', 'Sports', 'Boots', 'Sandals'];

const defaultForm = {
  name: '', description: '', price: '', category: 'Running',
  brand: '', sizes: '', colors: '', stock: '', image: '', isFeatured: false,
};

export default function AddProduct() {
  const navigate = useNavigate();
  const [form, setForm] = useState(defaultForm);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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
      }

      await axios.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content container">
      <div className="form-page-wrap">
        <div className="form-page-header">
          <button onClick={() => navigate(-1)} className="back-btn">← Back</button>
          <h1 className="heading-md">Add New Product</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Fill in the details to add a new shoe to the store</p>
        </div>

        {error && <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>{error}</div>}

        <form onSubmit={handleSubmit} className="product-form card">
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Product Name *</label>
              <input id="product-name" name="name" value={form.name} onChange={handleChange} className="form-input" placeholder="e.g. Air Max 2024" required />
            </div>
            <div className="form-group">
              <label className="form-label">Brand *</label>
              <input id="product-brand" name="brand" value={form.brand} onChange={handleChange} className="form-input" placeholder="e.g. Nike" required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description *</label>
            <textarea id="product-desc" name="description" value={form.description} onChange={handleChange} className="form-textarea" placeholder="Describe the product..." required />
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Price (₹) *</label>
              <input id="product-price" name="price" type="number" min="0" step="1" value={form.price} onChange={handleChange} className="form-input" placeholder="0" required />
            </div>
            <div className="form-group">
              <label className="form-label">Stock *</label>
              <input id="product-stock" name="stock" type="number" min="0" value={form.stock} onChange={handleChange} className="form-input" placeholder="0" required />
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select id="product-category" name="category" value={form.category} onChange={handleChange} className="form-select">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Product Image *</label>
              <input 
                id="product-image" 
                name="image" 
                type="file" 
                accept="image/*" 
                onChange={handleChange} 
                className="form-input" 
                required 
              />
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Sizes (comma separated)</label>
              <input id="product-sizes" name="sizes" value={form.sizes} onChange={handleChange} className="form-input" placeholder="6, 7, 8, 9, 10, 11" />
            </div>
            <div className="form-group">
              <label className="form-label">Colors (comma separated)</label>
              <input id="product-colors" name="colors" value={form.colors} onChange={handleChange} className="form-input" placeholder="Black, White, Red" />
            </div>
          </div>

          <label className="featured-checkbox">
            <input id="product-featured" name="isFeatured" type="checkbox" checked={form.isFeatured} onChange={handleChange} />
            <span>⭐ Mark as Featured Product</span>
          </label>

          <div className="form-actions">
            <button type="button" onClick={() => navigate(-1)} className="btn btn-secondary">Cancel</button>
            <button id="submit-product-btn" type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <><div className="btn-spinner" />Adding...</> : '✅ Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
