import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../context/FurnitureProductsProvider';
import { getProductByProductId } from '../api/productservice';
import './ProductDetail.css';

function ProductDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { customerFavorites, addToCart } = useProducts();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ name: '', email: '', rating: 0, comment: '' });
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const response = await getProductByProductId(productId);
      if (response.success) {
        setProduct(response.data);
      }
      setLoading(false);
    };
    fetchProduct();
  }, [productId]);

  if (loading) {
    return <div className="product-not-found">Loading...</div>;
  }

  if (!product) {
    return <div className="product-not-found">Product not found</div>;
  }

  const productImages = product.images?.length > 0 ? product.images.map(img => img.url) : [];

  const relatedProducts = customerFavorites
    .filter(p => p.category === product.category && p._id !== product._id)
    .slice(0, 4);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (reviewForm.rating === 0) return;
    setReviews([...reviews, { ...reviewForm, date: new Date().toLocaleDateString() }]);
    setReviewForm({ name: '', email: '', rating: 0, comment: '' });
  };

  return (
    <div className="product-detail-page">
      <div className="product-detail-container">
        <div className="product-images-section">
          <div className="thumbnail-images">
            {productImages.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`${product.name} view ${idx + 1}`}
                className={selectedImage === idx ? 'active' : ''}
                onClick={() => setSelectedImage(idx)}
              />
            ))}
          </div>
          <div className="main-image">
            <img src={productImages[selectedImage]} alt={product.name} />
          </div>
        </div>

        <div className="product-info-section">
          <h1>{product.name}</h1>
          <div className="product-price">₹{product.price.toLocaleString()}</div>
          <div className="product-meta">
            <span>SKU: {product._id}</span>
            <span className="rating">★ {product.rating.average}</span>
          </div>

          <p className="product-description">{product.description}</p>

          <div className="product-action">
            <div>
              <div className="quantity-selector">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                <input type="number" value={quantity} readOnly />
                <button onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
              <button className="add-to-cart-btn" onClick={handleAddToCart}>ADD TO CART</button>
            </div>
            <button className="buy-now-btn">BUY IT NOW</button>
          </div>

          <div className="product-details">
            <div className="detail-item"><strong>Brand:</strong> {product.brand}</div>
            <div className="detail-item"><strong>Material:</strong> {product.material}</div>
            <div className="detail-item"><strong>Color:</strong> {product.color}</div>
            <div className="detail-item"><strong>Warranty:</strong> {product.warranty}</div>
            <div className="detail-item">
              <strong>Availability:</strong>
              <span className={product.inStock ? 'in-stock' : 'out-stock'}>
                {product.inStock ? ' In Stock' : ' Out of Stock'}
              </span>
            </div>
          </div>

          <div className="delivery-info">
            <p>✓ Estimated Delivery: Up to 4 business days</p>
            <p>✓ Free Shipping & Returns: On all orders over ₹5000</p>
          </div>
        </div>
      </div>

      <div className="reviews-section">
        <h2>Customer Reviews</h2>

        {reviews.length === 0 ? (
          <p className="no-reviews">No reviews yet. Be the first to review!</p>
        ) : (
          <div className="reviews-list">
            {reviews.map((review, idx) => (
              <div key={idx} className="review-item">
                <div className="review-header">
                  <strong>{review.name}</strong>
                  <span className="review-rating">{'★'.repeat(review.rating)}</span>
                </div>
                <p className="review-date">{review.date}</p>
                <p className="review-comment">{review.comment}</p>
              </div>
            ))}
          </div>
        )}

        <div className="review-form">
          <h3>Write a Review</h3>
          <form onSubmit={handleReviewSubmit}>
            <div className="form-row">
              <input
                type="text"
                placeholder="Name *"
                value={reviewForm.name}
                onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                required
              />
              <input
                type="email"
                placeholder="Email *"
                value={reviewForm.email}
                onChange={(e) => setReviewForm({ ...reviewForm, email: e.target.value })}
                required
              />
            </div>
            <div className="rating-input">
              <label>Your Rating *</label>
              <div className="stars">
                {[1, 2, 3, 4, 5].map(star => (
                  <span
                    key={star}
                    className={reviewForm.rating >= star ? 'active' : ''}
                    onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                  >★</span>
                ))}
              </div>
            </div>
            <textarea
              placeholder="Your Review *"
              value={reviewForm.comment}
              onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
              required
            />
            <button type="submit" className="submit-review-btn">SUBMIT</button>
          </form>
        </div>
      </div>

      <div className="related-products-section">
        <h2>Related Products</h2>
        <div className="related-products-grid">
          {relatedProducts.map(relatedProduct => (
            <div key={relatedProduct._id} className="related-product-card" onClick={() => navigate(`/product/${relatedProduct._id}`)}>
              <img src={relatedProduct.images[0]?.url} alt={relatedProduct.name} />
              <h3>{relatedProduct.name}</h3>
              <p className="related-price">₹{relatedProduct.price.toLocaleString()}</p>
              <span className="related-rating">★ {relatedProduct.rating.average}</span>
            </div>
          ))}
        </div>
      </div>

      <section className="faq-section">
        <h2>FAQs</h2>
        <p className="faq-subtitle">Have a question? We are here to help.</p>
        <div className="faq-list">
          {[
            { q: 'Is the shipping free?', a: 'Yes, we offer free shipping on all orders over ₹5000. For orders below ₹5000, a nominal shipping charge applies.' },
            { q: 'When will I receive my item?', a: 'Estimated delivery time is up to 4 business days from the date of order confirmation. Delivery times may vary based on your location.' },
            { q: 'Can I change or return my item?', a: 'Yes, we accept returns within 7 days of delivery. The item must be unused and in its original packaging. Please contact our customer support to initiate a return.' },
            { q: 'What payment methods do you accept?', a: 'We accept all major credit/debit cards, UPI, net banking, and cash on delivery for eligible orders.' },
            { q: 'Do you provide assembly service?', a: 'Yes, we provide professional assembly service for an additional charge. You can opt for this service during checkout.' }
          ].map((faq, idx) => (
            <div key={idx} className="faq-item">
              <div className="faq-question" onClick={() => setOpenFaq(openFaq === idx ? null : idx)}>
                <span>{faq.q}</span>
                <span className="faq-icon">{openFaq === idx ? '−' : '+'}</span>
              </div>
              {openFaq === idx && <div className="faq-answer">{faq.a}</div>}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default ProductDetail;
