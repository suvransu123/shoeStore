import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useCart } from '../contexts/CartContext.jsx';
import axios from 'axios';
import toast from 'react-hot-toast';
import './ProductCard.css';

const PLACEHOLDER_IMG = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80';

export default function ProductCard({ product, onDelete }) {
  const { user } = useAuth();
  const { setCartCount } = useCart();

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to add items to your cart');
      return;
    }
    try {
      const defaultSize = product.sizes[0] || 9;
      const defaultColor = product.colors[0] || 'Default';
      await axios.post('/cart/add', {
        productId: product._id,
        quantity: 1,
        size: defaultSize,
        color: defaultColor,
      });
      setCartCount(prev => prev + 1);
      toast.success(`${product.name} added to cart`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart');
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    if (!confirm('Delete this product?')) return;
    try {
      await axios.delete(`/products/${product._id}`);
      onDelete?.(product._id);
      toast.success('Product deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`star ${i < Math.round(rating) ? '' : 'empty'}`}>★</span>
    ));
  };

  return (
    <Link to={`/products/${product._id}`} className="product-card card">
      <div className="product-card-image-wrap">
        <img
          src={product.image || PLACEHOLDER_IMG}
          alt={product.name}
          className="product-card-img"
          onError={e => { e.target.src = PLACEHOLDER_IMG; }}
        />
        {product.isFeatured && <span className="featured-tag">Featured</span>}
        {product.stock === 0 && <span className="out-of-stock-tag">Out of Stock</span>}
        <span className="category-tag">{product.category}</span>
      </div>

      <div className="product-card-body">
        <div className="card-top">
          <p className="product-brand">{product.brand}</p>
          <span className="product-price">₹{product.price?.toFixed(0)}</span>
        </div>
        <h3 className="product-name">{product.name}</h3>
        
        <div className="product-card-footer">
          <div className="product-info">
             <span>Stock: {product.stock}</span>
             <span className="rating">★ {product.rating || 0}</span>
          </div>
          
          <div className="card-actions">
            {user?.role !== 'admin' && (
              <button onClick={handleQuickAdd} className="btn btn-secondary btn-sm">Add to Cart</button>
            )}
            {user?.role === 'admin' && (
              <div className="admin-actions">
                <Link to={`/edit-product/${product._id}`} className="btn-link" onClick={e => e.stopPropagation()}>
                  Edit
                </Link>
                <button onClick={handleDelete} className="btn-link delete">
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
