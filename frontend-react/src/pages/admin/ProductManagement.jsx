import { useState, useEffect } from 'react';
import { getAllProducts, createProduct, updateProduct, deleteProduct } from '../../api/adminservice';
import { Plus, Edit, Trash2, Search, X, ChevronLeft, ChevronRight } from 'lucide-react';
import './ProductManagement.css';

const SkeletonCard = () => (
    <div className="product-card-admin skeleton-card">
        <div className="skeleton-image"></div>
        <div className="product-info">
            <div className="skeleton-text skeleton-title"></div>
            <div className="skeleton-text skeleton-price"></div>
            <div className="skeleton-text skeleton-stock"></div>
            <div className="skeleton-actions">
                <div className="skeleton-btn"></div>
                <div className="skeleton-btn"></div>
            </div>
        </div>
    </div>
);

export default function ProductManagement() {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
    const [filters, setFilters] = useState({ search: '', category: '', page: 1, limit: 12 });
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '', description: '', price: '', discount: 0, category: '', stock: '', color: '', material: '', brand: 'Aura Vista', warranty: ''
    });
    const [images, setImages] = useState([]);
    const [msg, setMsg] = useState({ error: '', success: '' });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, [filters]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await getAllProducts(filters);
            setProducts(response.data.data);
            setPagination({ page: response.data.page, totalPages: response.data.totalPages, total: response.data.total });


        } catch (err) {
            setMsg({ error: err.response?.data?.message || 'Failed to fetch products', success: '' });
        } finally {
            setLoading(false);
        }
    }

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
    }

    const handlePageChange = (newPage) => {
        setFilters((prev) => ({ ...prev, page: newPage }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    const openCreateModal = () => {
        setEditMode(false);
        setSelectedProduct(null);
        setFormData({ name: '', description: '', price: '', discount: 0, category: '', stock: '', color: '', material: '', brand: 'Aura Vista', warranty: '' });
        setImages([]);
        setShowModal(true);
        setMsg({ error: '', success: '' });
    }

    const openEditModal = (product) => {
        setEditMode(true);
        setSelectedProduct(product);
        setFormData({
            name: product.name, description: product.description, price: product.price, discount: product.discount || 0,
            category: product.category, stock: product.stock, color: product.color, material: product.material,
            brand: product.brand, warranty: product.warranty || ''
        });
        setShowModal(true);
        setImages([]);
        setMsg({ error: '', success: '' });

    }

    const validateForm = () => {
        if (!formData.name.trim()) return 'Product name is required';
        if (!formData.description.trim()) return 'Description is required';
        if (!formData.price || Number(formData.price) <= 0) return 'Price should be valid';
        if (!formData.category) return 'Category is required';
        if (!formData.stock || Number(formData.stock) < 0) return 'Stock must be 0 or more';
        if (!formData.color.trim()) return 'Color is required';
        if (!formData.material.trim()) return 'Material is required';
        return null;
    }

    const handleImageSelect = (e) => {
        const files = e.target.files;

        const validImages = [];

        for (let file of files) {
            if (!['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(file.type)) {
                setMsg({ error: 'Only JPG, PNG, WEBP images are allowed', success: '' });
                return;
            }

            if (file.size > 2 * 1024 * 1024) {
                setMsg({ error: 'Each image must be under 2MB', success: '' });
                return;
            }

            validImages.push(file);
        }

        setImages((prev) => [...prev, ...validImages]);

    }

    const removeImage = (ind) => {
        setImages((prev) => prev.filter((_, i) => i !== ind));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errorMsg = validateForm();

        if (errorMsg) {
            setMsg({ error: errorMsg, success: '' });
            return;
        }

        try {
            setSubmitting(true);
            setMsg({ error: '', success: '' });

            const data = new FormData();
            Object.keys(formData).forEach((key) => data.append(key, formData[key]));
            images.forEach((img) => data.append('images', img));

            if (editMode) {
                await updateProduct(selectedProduct._id, data);
                setMsg({ success: 'Product updated successfully', error: '' });
            } else {
                await createProduct(data);
                setMsg({ success: 'Product created successfully', error: '' });
            }

            fetchProducts();
            setTimeout(() => setShowModal(false), 1000);

        } catch (err) {
            setMsg({ error: err.response?.data?.message || 'Operation failed', success: '' });
        } finally {
            setSubmitting(false);
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you wanna delete this product?')) return;

        try {
            await deleteProduct(id);
            setMsg({ error: '', success: 'Product deleted successfully' });
            fetchProducts();
        } catch (err) {
            setMsg({ error: err.response?.data?.message || 'Failed to delete', success: '' });
        }
    }

    console.log('total pages: ', pagination.totalPages);

    return (
        <div className="product-management">
            <div className="page-header">
                <h1>Product Management</h1>
                <button className="btn-primary" onClick={openCreateModal}><Plus size={18} /> Add Product</button>
            </div>

            {msg.error && <div className="alert alert-error">{msg.error}</div>}
            {msg.success && <div className="alert alert-success">{msg.success}</div>}

            <div className="filters-bar">
                <div className="search-box">
                    <Search size={18} />
                    <input type="text" placeholder="Search products..." value={filters.search} onChange={(e) => handleFilterChange('search', e.target.value)} />
                </div>
                <select className="filter-select" value={filters.category} onChange={(e) => handleFilterChange('category', e.target.value)}>
                    <option value="">All Categories</option>
                    <option value="Sofa">Sofa</option>
                    <option value="Chair">Chair</option>
                    <option value="Table">Table</option>
                    <option value="Bed">Bed</option>
                    <option value="cabinet">Cabinet</option>
                    <option value="Storage">Storage</option>
                </select>
            </div>

            {
                loading ? (
                    <div className="products-grid-admin">
                        {[...Array(12)].map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                ) : (
                    <>
                        <div className="products-grid-admin">
                            {products.map(product => (
                                <div key={product._id} className="product-card-admin">
                                    <img src={product.images[0]?.url} alt={product.name} />
                                    <div className="product-info">
                                        <h3>{product.name}</h3>
                                        <p className="price">₹{product.price}</p>
                                        <p className="stock">Stock: {product.stock}</p>
                                        <div className="actions">
                                            <button onClick={() => openEditModal(product)}><Edit size={16} /></button>
                                            <button onClick={() => handleDelete(product._id)}><Trash2 size={16} /></button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {pagination.totalPages > 1 && (
                            <div className="pagination">
                                <button
                                    onClick={() => handlePageChange(pagination.page - 1)}
                                    disabled={pagination.page === 1}
                                    className="pagination-btn"
                                >
                                    <ChevronLeft size={18} /> Previous
                                </button>
                                <div className="pagination-info">
                                    Page {pagination.page} of {pagination.totalPages} ({pagination.total} products)
                                </div>
                                <button
                                    onClick={() => handlePageChange(pagination.page + 1)}
                                    disabled={pagination.page === pagination.totalPages}
                                    className="pagination-btn"
                                >
                                    Next <ChevronRight size={18} />
                                </button>
                            </div>
                        )}
                    </>
                )
            }
            {
                showModal && (
                    <div className="modal-overlay" onClick={() => setShowModal(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>{editMode ? 'Edit Product' : 'Add Product'}</h2>
                                <button className="close-btn-admin" onClick={() => setShowModal(false)}><X size={20} /></button>
                            </div>

                            {msg.error && <div className="alert alert-error">{msg.error}</div>}
                            {msg.success && <div className="alert alert-success">{msg.success}</div>}

                            <form onSubmit={handleSubmit} >
                                <div className="form-group">
                                    <label>Name *</label>
                                    <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Description *</label>
                                    <textarea rows="3" required value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Price *</label>
                                        <input type="number" required value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
                                    </div>
                                    <div className="form-group">
                                        <label>Discount (%)</label>
                                        <input type="number" value={formData.discount} onChange={(e) => setFormData({ ...formData, discount: e.target.value })} />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Category *</label>
                                        <select required value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                                            <option value="">Select</option>
                                            <option value="Sofa">Sofa</option>
                                            <option value="Chair">Chair</option>
                                            <option value="Table">Table</option>
                                            <option value="Bed">Bed</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Stock *</label>
                                        <input type="number" min='0' required value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Color *</label>
                                        <input type="text" required value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} />
                                    </div>
                                    <div className="form-group">
                                        <label>Material *</label>
                                        <input type="text" required value={formData.material} onChange={(e) => setFormData({ ...formData, material: e.target.value })} />
                                    </div>
                                </div>

                                {/* Image Upload */}
                                <div className="form-group">
                                    <label>Images (JPG / PNG / WEBP • max 2MB)</label>
                                    <input type="file" multiple accept="image/*" onChange={handleImageSelect} />
                                </div>

                                {/* Image previews */}

                                {images.length > 0 && (
                                    <div className="image-preview-grid">
                                        {images.map((img, index) => (
                                            <div key={index} className="image-preview">
                                                <img src={URL.createObjectURL(img)} alt="preview" />
                                                <button type="button" onClick={() => removeImage(index)}>✕</button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="modal-actions">
                                    <button type="button" className="btn-cancel" onClick={() => setShowModal(false)} disabled={submitting}>Cancel</button>
                                    <button type="submit" className="btn-submit" disabled={submitting}>{submitting ? 'Saving...' : 'Save'}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }


        </div>

    );

}