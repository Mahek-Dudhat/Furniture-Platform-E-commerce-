import './ProductsGrid.css'
import { NavLink } from 'react-router-dom';
import { useState, memo } from 'react';
import SkeletonLoader from '../../common/SkeletonLoader';
import { useProducts } from '../../../context/FurnitureProductsProvider';
import { getAllProducts } from '../../../api/productservice.js';
import { useEffect } from 'react';

const ProductsGrid = memo(function ProductsGrid({ filters, setFilters, category }) {


    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [pagination, setPagination] = useState({
        total: 0,
        totalPages: 0,
        page: 1,
        hasMore: false
    })

    const { addToCart } = useProducts();

    useEffect(() => {
        const loadProducts = async () => {
            setLoading(true);
            try {

                // Build query parameters:
                const params = {
                    page: filters.page,
                    limit: 4,
                }

                // Add category from URL params
                if (category && category !== 'all') {
                    params.category = category;
                }

                // Add filters
                if (filters.search) params.search = filters.search;
                if (filters?.minPrice > 0) params.minPrice = filters.minPrice;
                if (filters?.maxPrice < 150000) params.maxPrice = filters.maxPrice;
                if (filters?.selectedBrands?.length > 0) params.brand = filters.selectedBrands;
                if (filters?.selectedColors?.length > 0) params.color = filters.selectedColors;
                if (filters?.selectedMaterials?.length > 0) params.material = filters.selectedMaterials;
                if (filters?.inStock) params.inStock = filters.inStock;
                if (filters.sort) {
                    params.sort = filters.sort;
                    params.order = filters.order;
                }

                const response = await getAllProducts(params);
                //console.log('API Response:', response);

                if (response.success) {
                    setProducts(response.data);
                    setPagination({
                        total: response.total,
                        page: response.page,
                        totalPages: response.totalPages,
                        hasMore: response.hasMore
                    })
                }

            } catch (err) {
                console.error("Error fetching products:", err);
                setError(err.message || 'Failed to load products');
            } finally {
                setLoading(false);
            }
        }

        loadProducts();
    }, [filters, category])

    const handleSortChange = (e) => {
        const value = e.target.value;

        let sort = '';
        let order = 'asc';

        switch (value) {
            case 'asc':
                sort = 'name';
                order = 'asc';
                break;
            case 'desc':
                sort = 'name';
                order = 'desc';
                break;
            case 'lowtohigh':
                sort = 'price';
                order = 'asc';
                break;
            case 'hightolow':
                sort = 'price';
                order = 'desc';
                break;
            case 'rating':
                sort = 'rating';
                order = 'desc';
                break;
            case 'discount':
                sort = 'discount';
                order = 'desc';
                break;
            default:
                sort = '';
                order = 'asc';
        }

        setFilters(prev => ({ ...prev, sort, order, page: 1 }));
    }

    const handlePageChange = (newPage) => {
        setFilters(prev => ({ ...prev, page: newPage }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // console.log("Products data:", products);
    // console.log('Dynamic filters: ', filters);

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

    if (error) {
        return (
            <div className="products-error-container">
                <div className="error-icon">⚠️</div>
                <h2>Unable to Load Products</h2>
                <p>{error}</p>
                <button onClick={() => window.location.reload()} className="retry-btn">Retry</button>
            </div>
        );
    }

    return (
        <div className="products-container-grid">
            <div className="products-header-bar">
                <p>
                    {loading ? 'Loading...' : `${pagination.total} product${pagination.total !== 1 ? 's' : ''}`}
                </p>
                <select className="sort-select" value={filters.sort === 'name' && filters.order === 'asc' ? 'asc' :
                    filters.sort === 'name' && filters.order === 'desc' ? 'desc' :
                        filters.sort === 'price' && filters.order === 'asc' ? 'lowtohigh' :
                            filters.sort === 'price' && filters.order === 'desc' ? 'hightolow' :
                                filters.sort === 'rating' ? 'rating' :
                                    filters.sort === 'discount' ? 'discount' : 'default'} onChange={handleSortChange}>
                    <option value='default'>Sort by: Default</option>
                    <option value='asc'>A to Z</option>
                    <option value='desc'>Z to A</option>
                    <option value='lowtohigh'>Price: Low to High</option>
                    <option value='hightolow'>Price: High to Low</option>
                    <option value='rating'>Best Rating</option>
                    <option value='discount'>Best Discount</option>
                </select>
            </div>

            <div className="products-container">
                {
                    loading ? (
                        <SkeletonLoader count={12} />
                    ) : products?.length > 0 ? (
                        products?.map(product => (
                            <NavLink key={product._id} to={`/product/${product._id}`}>
                                <div className="product-card">
                                    <div className="product-image">
                                        <img src={product.images[0]?.url} alt={product.name}
                                            loading="lazy" />
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
                                    <div className="product-info py-3">
                                        <h3>{product.name}</h3>
                                        <div className="product-rating">
                                            {renderStars(product.rating.average)}
                                        </div>
                                        <div className="product-price">
                                            <span className="current-price">₹{product.price}</span>
                                            {product.discount > 0 && (
                                                <span className="original-price">
                                                    ₹{Math.round(product.price / (1 - product.discount / 100))}
                                                </span>

                                            )}
                                        </div>
                                        <button className="add-to-cart-btn" onClick={(e) => {
                                            e.preventDefault();
                                            addToCart(product);
                                        }}>Add to Cart</button>
                                    </div>
                                </div>
                            </NavLink>
                        ))
                    ) : (
                        <div className="no-products">
                            <h2>No products found</h2>
                            <p>Try adjusting your filters or search criteria.</p>
                        </div>
                    )

                }

            </div >

            {/* Pagination */}
            {
                pagination.totalPages > 1 && (
                    <div className="pagination">
                        <button
                            className="pagination-btn"
                            onClick={() => handlePageChange(pagination.page - 1)}
                            disabled={pagination.page === 1}
                        >
                            Previous
                        </button>

                        <div className="pagination-numbers">
                            {
                                [...Array(pagination.totalPages)].map((_, index) => {
                                    const pageNum = index + 1;

                                    // Show first page, last page, current page, and pages around current
                                    if (
                                        pageNum === 1 ||
                                        pageNum === pagination.totalPages ||
                                        (pageNum >= pagination.page - 1 && pageNum <= pagination.page + 1)
                                    ) {
                                        return (
                                            <button
                                                key={pageNum}
                                                className={`pagination-number ${pageNum === pagination.page ? 'active' : ''}`}
                                                onClick={() => handlePageChange(pageNum)}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    } else if (
                                        pageNum === pagination.page - 2 ||
                                        pageNum === pagination.page + 2
                                    ) {
                                        return <span key={pageNum} className="pagination-dots">...</span>;
                                    }
                                    return null;
                                })
                            }
                        </div>

                        <button
                            className="pagination-btn"
                            onClick={() => handlePageChange(pagination.page + 1)}
                            disabled={!pagination.hasMore}
                        >
                            Next
                        </button>
                    </div>
                )
            }
        </div >
    )
});

export default ProductsGrid
