import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard.jsx';
import './CategoryPage.css';

export default function CategoryPage() {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      setLoading(true);
      try {
        // Ensure category is uppercase to match DB
        const res = await axios.get('/products', {
          params: { category: categoryName.toUpperCase() }
        });
        setProducts(res.data.products);
      } catch (error) {
        console.error('Failed to fetch category products', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [categoryName]);

  const handleDelete = (id) => setProducts(prev => prev.filter(p => p._id !== id));

  return (
    <div className="page-content container">
      <header className="category-header">
        <h1 className="heading-lg">{categoryName} Collection</h1>
        <p className="category-subtext">Showing all results for {categoryName}</p>
      </header>

      {loading ? (
        <div className="loading-center"><div className="spinner" /></div>
      ) : products.length === 0 ? (
        <div className="empty-state">
          <h3>No shoes found in this category</h3>
        </div>
      ) : (
        <div className="products-grid">
          {products.map(product => (
            <ProductCard key={product._id} product={product} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
