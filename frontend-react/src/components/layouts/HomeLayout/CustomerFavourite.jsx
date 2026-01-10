import './CustomerFavourite.css'
import { useProducts } from '../../../context/FurnitureProductsProvider'
import { useState } from 'react'
import { NavLink } from 'react-router-dom';
import SkeletonLoader from '../../common/SkeletonLoader';

function CustomerFavourite() {
  const { customerFavorites, addToCart } = useProducts();
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState('');
  const itemsPerPage = 4;
  const totalPages = Math.ceil((customerFavorites?.length || 0) / itemsPerPage);

  const currentProducts = (customerFavorites || []).slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setDirection('next');
      setCurrentPage(currentPage + 1);
    }
  };
//  console.log('customer gavourite', customerFavorites);
  const handlePrev = () => {
    if (currentPage > 0) {
      setDirection('prev');
      setCurrentPage(currentPage - 1);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="star full">★</span>);
    }
    if (hasHalfStar) {
      stars.push(<span key="half" className="star half">★</span>);
    }
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star empty">★</span>);
    }
    return stars;
  };

  return (
    <section className="customer-products">
      <div className="container">
        <div className="customer-header">
          <h3 className='cust-sub'>Customer favorites and design</h3>
          <h1>Our Biggest Sales</h1>
        </div>
        <div className="pagination-wrapper">
          <button
            className="pagination-arrow left"
            onClick={handlePrev}
            disabled={currentPage === 0}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>

          <div className={`products-grid ${direction}`}>
            {!customerFavorites || customerFavorites.length === 0 ? (
              <SkeletonLoader count={4} />
            ) : currentProducts.map((product) => (
              <NavLink key={product._id} to={`/product/${product._id}`}>
                <div className="product-card">
                  <div className="product-image">
                    <img src={product.images[0]?.url} alt={product.name} />
                    {product.discount > 0 && (
                      <span className="discount-badge">-{product.discount}%</span>
                    )}
                    <div className="product-actions">
                      <button className="action-btn" title="Add to Wishlist">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                      </button>
                      <button className="action-btn" title="Quick View">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      </button>
                      <button className="action-btn" title="Compare">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="17 1 21 5 17 9"></polyline>
                          <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
                          <polyline points="7 23 3 19 7 15"></polyline>
                          <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <p className="product-category">{product.category}</p>
                    <div className="product-rating">
                      {renderStars(product.rating)}
                    </div>
                    <div className="product-price">
                      <span className="current-price">₹{product.price}</span>
                      {product.discount > 0 && (
                        <span className="original-price">
                          ₹{Math.round(product.price / (1 - product.discount / 100))}
                        </span>
                      )}
                    </div>
                    <button className="add-to-cart-btn" onClick={(e) => { e.preventDefault(); addToCart(product) }}>Add to Cart</button>
                  </div>
                </div>
              </NavLink>
            ))}
          </div>

          <button
            className="pagination-arrow right"
            onClick={handleNext}
            disabled={currentPage === totalPages - 1}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>

        </div>
      </div>
    </section>
  )
}

export default CustomerFavourite
