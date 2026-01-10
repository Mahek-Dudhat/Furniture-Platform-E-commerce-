import { useState, useEffect } from 'react';
import { getAllCoupons, createCoupon, updateCoupon, deleteCoupon, toggleCouponStatus } from '../../api/adminservice';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import './CouponManagement.css';

export default function CouponManagement() {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedCoupon, setSelectedCoupon] = useState(null);
    const [formData, setFormData] = useState({
        code: '', discountType: 'percentage', discountValue: '', minPurchase: 0, maxDiscount: '', validFrom: '', validUntil: '', usageLimit: ''
    });
    const [msg, setMsg] = useState({ error: '', success: '' });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        try {
            setLoading(true);
            const response = await getAllCoupons();
            setCoupons(response.data.data);
        } catch (err) {
            setMsg({ error: err.response?.data?.message || 'Failed to fetch coupons', success: '' });
        } finally {
            setLoading(false);
        }
    };

    const openCreateModal = () => {
        setEditMode(false);
        setSelectedCoupon(null);
        setFormData({ code: '', discountType: 'percentage', discountValue: '', minPurchase: 0, maxDiscount: '', validFrom: '', validUntil: '', usageLimit: '' });
        setShowModal(true);
        setMsg({ error: '', success: '' });
    };

    const openEditModal = (coupon) => {
        setEditMode(true);
        setSelectedCoupon(coupon);
        setFormData({
            code: coupon.code, discountType: coupon.discountType, discountValue: coupon.discountValue,
            minPurchase: coupon.minPurchase, maxDiscount: coupon.maxDiscount || '',
            validFrom: coupon.validFrom?.split('T')[0], validUntil: coupon.validUntil?.split('T')[0],
            usageLimit: coupon.usageLimit || ''
        });
        setShowModal(true);
        setMsg({ error: '', success: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            setMsg({ error: '', success: '' });
            if (editMode) {
                await updateCoupon(selectedCoupon._id, formData);
                setMsg({ error: '', success: 'Coupon updated successfully' });
            } else {
                await createCoupon(formData);
                setMsg({ error: '', success: 'Coupon created successfully' });
            }
            fetchCoupons();
            setTimeout(() => setShowModal(false), 1500);
        } catch (err) {
            setMsg({ error: err.response?.data?.message || 'Operation failed', success: '' });
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this coupon?')) return;
        try {
            await deleteCoupon(id);
            setMsg({ error: '', success: 'Coupon deleted successfully' });
            fetchCoupons();
        } catch (err) {
            setMsg({ error: err.response?.data?.message || 'Failed to delete', success: '' });
        }
    };

    const handleToggle = async (id) => {
        try {
            await toggleCouponStatus(id);
            fetchCoupons();
        } catch (err) {
            setMsg({ error: err.response?.data?.message || 'Failed to toggle status', success: '' });
        }
    };

    return (
        <div className="coupon-management">
            <div className="page-header">
                <h1>Coupon Management</h1>
                <button className="btn-primary" onClick={openCreateModal}><Plus size={18} /> Add Coupon</button>
            </div>

            {msg.error && <div className="alert alert-error">{msg.error}</div>}
            {msg.success && <div className="alert alert-success">{msg.success}</div>}

            {loading ? <div className="loading">Loading...</div> : (
                <div className="coupons-table-container">
                    <table className="coupons-table">
                        <thead>
                            <tr>
                                <th>Code</th>
                                <th>Type</th>
                                <th>Value</th>
                                <th>Min Purchase</th>
                                <th>Valid Until</th>
                                <th>Usage</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {coupons.map(coupon => (
                                <tr key={coupon._id}>
                                    <td className="coupon-code">{coupon.code}</td>
                                    <td>{coupon.discountType}</td>
                                    <td>{coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}</td>
                                    <td>₹{coupon.minPurchase}</td>
                                    <td>{new Date(coupon.validUntil).toLocaleDateString()}</td>
                                    <td>{coupon.usedCount}/{coupon.usageLimit || '∞'}</td>
                                    <td>
                                        <button className={`toggle-btn ${coupon.isActive ? 'active' : 'inactive'}`} onClick={() => handleToggle(coupon._id)}>
                                            {coupon.isActive ? 'Active' : 'Inactive'}
                                        </button>
                                    </td>
                                    <td>
                                        <div className="actions">
                                            <button onClick={() => openEditModal(coupon)}><Edit size={16} /></button>
                                            <button onClick={() => handleDelete(coupon._id)}><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editMode ? 'Edit Coupon' : 'Create Coupon'}</h2>
                            <button className="close-btn" onClick={() => setShowModal(false)}><X size={20} /></button>
                        </div>

                        {msg.error && <div className="alert alert-error">{msg.error}</div>}
                        {msg.success && <div className="alert alert-success">{msg.success}</div>}

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Coupon Code *</label>
                                <input type="text" required value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })} />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Discount Type *</label>
                                    <select required value={formData.discountType} onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}>
                                        <option value="percentage">Percentage</option>
                                        <option value="fixed">Fixed Amount</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Discount Value *</label>
                                    <input type="number" required value={formData.discountValue} onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })} />
                                </div>
                                
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Min Purchase</label>
                                    <input type="number" value={formData.minPurchase} onChange={(e) => setFormData({ ...formData, minPurchase: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Max Discount</label>
                                    <input type="number" value={formData.maxDiscount} onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })} />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Valid From *</label>
                                    <input type="date" required value={formData.validFrom} onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Valid Until *</label>
                                    <input type="date" required value={formData.validUntil} onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Usage Limit</label>
                                <input type="number" placeholder="Leave empty for unlimited" value={formData.usageLimit} onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })} />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)} disabled={submitting}>Cancel</button>
                                <button type="submit" className="btn-submit" disabled={submitting}>{submitting ? 'Saving...' : 'Save'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
