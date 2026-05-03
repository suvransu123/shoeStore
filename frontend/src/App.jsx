import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Contexts
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import { CartProvider } from './contexts/CartContext.jsx';

// Components & Pages
import Navbar from './components/Navbar.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import ProductList from './pages/ProductList.jsx';
import ProductDetails from './pages/ProductDetails.jsx';
import AddProduct from './pages/AddProduct.jsx';
import EditProduct from './pages/EditProduct.jsx';
import Cart from './pages/Cart.jsx';
import Profile from './pages/Profile.jsx';
import CategoryPage from './pages/CategoryPage.jsx';


const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/" replace />;
  
  return children;
};


const LoadingSpinner = () => (
  <div className="loading-center" style={{ height: '100vh' }}>
    <div className="spinner" />
  </div>
);


export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Toaster position="top-center" />
          <Navbar />
          
          <div className="page-wrapper">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<ProductList />} />
              <Route path="/login" element={<LoginRedirect><Login /></LoginRedirect>} />
              <Route path="/signup" element={<LoginRedirect><Signup /></LoginRedirect>} />
              <Route path="/products/:id" element={<ProductDetails />} />
              <Route path="/category/:categoryName" element={<CategoryPage />} />

              {/* Private Routes */}
              <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

              {/* Admin Routes */}
              <Route path="/add-product" element={<ProtectedRoute adminOnly><AddProduct /></ProtectedRoute>} />
              <Route path="/edit-product/:id" element={<ProtectedRoute adminOnly><EditProduct /></ProtectedRoute>} />

              {/* 404 Fallback */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

/**
 * Redirects logged-in users away from Login/Signup pages
 */
const LoginRedirect = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  return user ? <Navigate to="/" replace /> : children;
};
