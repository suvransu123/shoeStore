import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext.jsx';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartCount, setCartCount] = useState(0);

  // Sync cart count when user changes
  useEffect(() => {
    if (user) {
      axios.get('/cart')
        .then(res => setCartCount(res.data.items?.length || 0))
        .catch(() => setCartCount(0));
    } else {
      setCartCount(0);
    }
  }, [user]);

  return (
    <CartContext.Provider value={{ cartCount, setCartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
