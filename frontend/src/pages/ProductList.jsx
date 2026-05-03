import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext.jsx';
import ProductCard from '../components/ProductCard.jsx';
import './ProductList.css';

const CATEGORIES = ['All', 'Sneakers', 'Sports', 'Boots', 'Sandals', 'Formal'];

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('newest');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
   const { user } = useAuth();
   const navigate = useNavigate();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = { sort };
      if (category !== 'All') params.category = category.toUpperCase();
      if (search) params.search = search;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      const res = await axios.get('/products', { params });
      setProducts(res.data.products);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(fetchProducts, 300);
    return () => clearTimeout(delay);
  }, [category, sort, search, minPrice, maxPrice]);

  const handleDelete = (id) => setProducts(prev => prev.filter(p => p._id !== id));

  const clearFilters = () => {
    setSearch(''); setCategory('All'); setSort('newest');
    setMinPrice(''); setMaxPrice('');
  };

  return (
    <div className="page-content container">
      {/* Page Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="heading-lg">Shoe Store</h1>
          <p>Discover our collection of premium footwear</p>
        </div>
        {user?.role === 'admin' && (
          <button onClick={() => navigate('/add-product')} className="btn btn-primary">
            + Add Product
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="search-bar-wrap">
        <input
          id="search-input"
          type="text"
          className="search-input"
          placeholder="Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ paddingLeft: '1rem' }}
        />
        {search && <button className="search-clear" onClick={() => setSearch('')}>Clear</button>}
      </div>

      {/* Filters Section */}
      <div className="filters-container card">
        <div className="filter-row">
          <div className="filter-group">
            <label className="filter-label">Category</label>
            <div className="category-pills">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`category-pill ${category === cat ? 'active' : ''}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <label className="filter-label">Price Range</label>
            <div className="price-inputs">
              <input type="number" placeholder="Min" value={minPrice} onChange={e => setMinPrice(e.target.value)} className="form-input" />
              <input type="number" placeholder="Max" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} className="form-input" />
            </div>
          </div>

          <div className="filter-group">
            <label className="filter-label">Sort</label>
            <select className="form-select" value={sort} onChange={e => setSort(e.target.value)}>
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Rating</option>
            </select>
          </div>

          <button onClick={clearFilters} className="clear-filters-btn">Reset</button>
        </div>
      </div>

      {/* Products Area */}
      <main className="products-area">
        <div className="products-toolbar">
          <p className="results-count">
            {loading ? 'Loading...' : `${products.length} products found`}
          </p>
        </div>

        {loading ? (
          <div className="loading-center"><div className="spinner" /></div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <h3>No products found</h3>
            <p>Try adjusting your search or filters.</p>
            <button onClick={clearFilters} className="btn btn-primary" style={{ marginTop: '1rem' }}>Clear Filters</button>
          </div>
        ) : (
          <div className="products-grid">
            {products.map(product => (
              <ProductCard key={product._id} product={product} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
