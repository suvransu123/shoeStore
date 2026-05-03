import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useCart } from '../contexts/CartContext.jsx';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const categories = ['Sneakers', 'Sports', 'Boots', 'Sandals', 'Formal'];

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-inner container">
        {/* Logo */}
        <Link to="/" className="navbar-brand">
          <span className="brand-name">SoleStyle</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="navbar-links">
          <Link to="/" className={`nav-link ${isActive('/') ? 'nav-link-active' : ''}`}>Store</Link>
          <div className="nav-dropdown">
            <span className="nav-link">Categories ▾</span>
            <div className="nav-dropdown-content">
              {categories.map(cat => (
                <Link key={cat} to={`/category/${cat.toUpperCase()}`}>{cat}</Link>
              ))}
            </div>
          </div>
          {user?.role === 'admin' && (
            <Link to="/add-product" className={`nav-link ${isActive('/add-product') ? 'nav-link-active' : ''}`}>
              Add Product
            </Link>
          )}
        </div>

        {/* Desktop Actions */}
        <div className="navbar-actions">
          {user ? (
            <>
              <Link to="/cart" className="nav-cart-btn">
                Cart
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </Link>
              <Link to="/profile" className="nav-avatar" title={user.name}>
                {user.name.charAt(0).toUpperCase()}
              </Link>
              <button onClick={handleLogout} className="btn btn-secondary btn-sm">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary btn-sm">Login</Link>
              <Link to="/signup" className="btn btn-primary btn-sm">Sign Up</Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${menuOpen ? 'mobile-menu-open' : ''}`}>
        <Link to="/" className="mobile-link">Store</Link>
        <div className="mobile-category-group">
          <p className="mobile-group-label">Categories</p>
          {categories.map(cat => (
            <Link key={cat} to={`/category/${cat.toUpperCase()}`} className="mobile-link small">{cat}</Link>
          ))}
        </div>
        {user?.role === 'admin' && <Link to="/add-product" className="mobile-link">Add Product</Link>}
        {user ? (
          <>
            <Link to="/cart" className="mobile-link">Cart {cartCount > 0 && `(${cartCount})`}</Link>
            <Link to="/profile" className="mobile-link">Profile</Link>
            <button onClick={handleLogout} className="mobile-link mobile-logout">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="mobile-link">Login</Link>
            <Link to="/signup" className="mobile-link">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
