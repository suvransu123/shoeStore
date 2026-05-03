import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CartItem from '../components/CartItem.jsx';
import './Cart.css';

export default function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    axios.get('/cart')
      .then(res => setCart(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleClear = async () => {
    if (!confirm('Clear your entire cart?')) return;
    setClearing(true);
    try {
      await axios.delete('/cart/clear');
      setCart({ items: [], totalPrice: 0 });
    } catch { alert('Failed to clear cart'); }
    finally { setClearing(false); }
  };

  if (loading) return <div className="loading-center container"><div className="spinner" /></div>;

  const items = cart?.items || [];
  const total = cart?.totalPrice || 0;

  return (
    <div className="page-content container">
      <div className="page-header">
        <h1 className="heading-lg">Your Cart</h1>
        <p>{items.length} item{items.length !== 1 ? 's' : ''} in cart</p>
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <h3>Your cart is empty</h3>
          <p>Browse our collection and add some shoes!</p>
          <Link to="/" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>Browse Store</Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items-col">
            <div className="cart-items-header">
              <span>Items</span>
              <button onClick={handleClear} className="btn btn-danger btn-sm" disabled={clearing}>
                {clearing ? 'Clearing...' : 'Clear Cart'}
              </button>
            </div>
            <div className="cart-items-list">
              {items.map(item => (
                <CartItem
                  key={item._id}
                  item={item}
                  onUpdate={setCart}
                  onRemove={setCart}
                />
              ))}
            </div>
          </div>

          <div className="cart-summary card">
            <h3 className="heading-sm">Order Summary</h3>
            <div className="divider" />
            <div className="summary-row">
              <span>Subtotal ({items.length} items)</span>
              <span>₹{total.toFixed(0)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span className="free-shipping">FREE</span>
            </div>
            <div className="summary-row">
              <span>Tax (8%)</span>
              <span>₹{(total * 0.08).toFixed(0)}</span>
            </div>
            <div className="divider" />
            <div className="summary-row summary-total">
              <span>Total</span>
              <span>₹{(total * 1.08).toFixed(0)}</span>
            </div>
            <button
              id="checkout-btn"
              className="btn btn-primary btn-full btn-lg"
              style={{ marginTop: '1.5rem' }}
              onClick={() => alert('Checkout flow coming soon!')}
            >
              Proceed to Checkout
            </button>
            <Link to="/" className="btn btn-secondary btn-full" style={{ marginTop: '0.75rem' }}>
              Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
