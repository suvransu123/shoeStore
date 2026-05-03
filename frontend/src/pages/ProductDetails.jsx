import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useCart } from '../contexts/CartContext.jsx';
import './ProductDetails.css';

const PLACEHOLDER_IMG = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setCartCount } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    axios.get(`/products/${id}`)
      .then(res => {
        setProduct(res.data.product);
        setSelectedSize(res.data.product.sizes?.[0] || null);
        setSelectedColor(res.data.product.colors?.[0] || null);
      })
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please login to add items to your cart');
      navigate('/login');
      return;
    }
    if (!selectedSize) { toast.error('Please select a size'); return; }
    if (!selectedColor) { toast.error('Please select a color'); return; }
    
    setAdding(true);
    try {
      await axios.post('/cart/add', { productId: id, quantity: qty, size: selectedSize, color: selectedColor });
      setCartCount(prev => prev + 1);
      toast.success('Added to cart!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart');
    } finally {
      setAdding(false);
    }
  };

  const renderStars = (rating) =>
    Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`star ${i < Math.round(rating) ? '' : 'empty'}`}>★</span>
    ));

  if (loading) return <div className="loading-center container"><div className="spinner" /></div>;
  if (!product) return null;

  return (
    <div className="page-content container">
      <button onClick={() => navigate(-1)} className="back-btn">Back</button>

      <div className="product-detail-grid">
        {/* Image */}
        <div className="detail-image-wrap">
          <img
            src={product.image || PLACEHOLDER_IMG}
            alt={product.name}
            className="detail-image"
            onError={e => { e.target.src = PLACEHOLDER_IMG; }}
          />
          {product.isFeatured && <span className="detail-badge-featured">Featured</span>}
        </div>

        {/* Info */}
        <div className="detail-info">
          <span className="detail-category badge badge-primary">{product.category}</span>
          <p className="detail-brand">{product.brand}</p>
          <h1 className="heading-lg detail-name">{product.name}</h1>

          <div className="detail-rating">
            <div className="stars">{renderStars(product.rating)}</div>
            <span className="detail-reviews">{product.rating?.toFixed(1)} ({product.numReviews} reviews)</span>
          </div>

          <div className="detail-price">₹{product.price?.toFixed(0)}</div>

          <p className="detail-description">{product.description}</p>

          <div className="divider" />

          {/* Sizes */}
          {product.sizes?.length > 0 && (
            <div className="detail-option-section">
              <h4 className="option-label">Size: <span>{selectedSize}</span></h4>
              <div className="size-grid">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`size-btn ${selectedSize === size ? 'size-btn-active' : ''}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Colors */}
          {product.colors?.length > 0 && (
            <div className="detail-option-section">
              <h4 className="option-label">Color: <span>{selectedColor}</span></h4>
              <div className="color-options">
                {product.colors.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`color-chip ${selectedColor === color ? 'color-chip-active' : ''}`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="detail-option-section">
            <h4 className="option-label">Quantity</h4>
            <div className="qty-row">
              <div className="qty-control">
                <button className="qty-btn" onClick={() => setQty(Math.max(1, qty - 1))} disabled={qty <= 1}>−</button>
                <span className="qty-value">{qty}</span>
                <button className="qty-btn" onClick={() => setQty(qty + 1)}>+</button>
              </div>
              <span className="stock-info">{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</span>
            </div>
          </div>

          <button
            id="add-to-cart-btn"
            onClick={handleAddToCart}
            className="btn btn-primary btn-lg btn-full"
            disabled={adding || product.stock === 0}
          >
            {adding ? 'Adding...' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>

          {user?.role === 'admin' && (
            <button onClick={() => navigate(`/edit-product/${product._id}`)} className="btn btn-secondary btn-full" style={{ marginTop: '0.75rem' }}>
              Edit Product
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
