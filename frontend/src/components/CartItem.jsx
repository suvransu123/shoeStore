import axios from 'axios';
import { useCart } from '../contexts/CartContext.jsx';
import './CartItem.css';

const PLACEHOLDER_IMG = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&q=80';

export default function CartItem({ item, onUpdate, onRemove }) {
  const { setCartCount } = useCart();
  const { product, quantity, size, color, price, _id } = item;

  const handleQuantityChange = async (newQty) => {
    try {
      const res = await axios.put(`/cart/update/${_id}`, { quantity: newQty });
      onUpdate(res.data.cart);
      setCartCount(res.data.cart.items.length);
    } catch (err) {
      alert('Failed to update quantity');
    }
  };

  const handleRemove = async () => {
    try {
      const res = await axios.delete(`/cart/remove/${_id}`);
      onRemove(res.data.cart);
      setCartCount(res.data.cart.items.length);
    } catch (err) {
      alert('Failed to remove item');
    }
  };

  return (
    <div className="cart-item card">
      <img
        src={product?.image || PLACEHOLDER_IMG}
        alt={product?.name}
        className="cart-item-img"
        onError={e => { e.target.src = PLACEHOLDER_IMG; }}
      />
      <div className="cart-item-info">
        <p className="cart-item-brand">{product?.brand}</p>
        <h4 className="cart-item-name">{product?.name}</h4>
        <div className="cart-item-meta">
          <span className="meta-chip">Size: {size}</span>
          <span className="meta-chip">Color: {color}</span>
        </div>
      </div>
      <div className="cart-item-controls">
        <div className="qty-control">
          <button
            className="qty-btn"
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={quantity <= 1}
          >−</button>
          <span className="qty-value">{quantity}</span>
          <button className="qty-btn" onClick={() => handleQuantityChange(quantity + 1)}>+</button>
        </div>
        <p className="cart-item-price">₹{(price * quantity).toFixed(0)}</p>
        <button className="cart-remove-btn" onClick={handleRemove}>Remove</button>
      </div>
    </div>
  );
}
