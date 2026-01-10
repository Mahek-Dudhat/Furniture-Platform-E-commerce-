import { useState, useEffect, useRef } from 'react';
import { getAllOrders, updateOrderStatus } from '../../api/adminservice';
import { Search, Filter, Eye, Truck, Package, CheckCircle, X } from 'lucide-react';
import './OrdersManagement.css';


export default function OrdersManagement() {

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
    const [filters, setFilters] = useState({
        status: '',
        search: '',
        page: 1,
        limit: 20
    });

    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [updateData, setUpdateData] = useState({
        status: '',
        note: '',
        trackingNumber: '',
        courier: '',
        trackingUrl: ''
    });
    const [msg, setMsg] = useState({ error: '', success: '' });
    const [updating, setUpdating] = useState(false);

    // Debounce timer reference
    const searchTimeout = useRef(null);

    useEffect(() => {
        fetchOrders();
    }, [filters]);

    const handleSearchChange = async (value) => {
        clearTimeout(searchTimeout.current);

        searchTimeout.current = setTimeout(() => {
            setFilters(prev => ({
                ...prev,
                search: value,
                page: 1
            }));
        }, 400);
    }

    //Fetch orders:
    const fetchOrders = async () => {
        try {
            setLoading(true);
            setMsg({ error: '', success: '' });
            const response = await getAllOrders(filters);
            setOrders(response.data.data);
            setPagination({
                page: response.data.page,
                totalPages: response.data.totalPages,
                total: response.data.total
            });

        } catch (err) {
            setMsg({ error: err.response?.data?.message || 'Failed to fetch orders', success: '' });
        } finally {
            setLoading(false);
        }
    }

    const handleStatusChange = (value) => {
        setFilters((prev) => ({ ...prev, status: value, page: 1 }));
    }

    const handlePageChange = (newPage) => {
        setFilters((prev) => ({ ...prev, page: newPage }));
    }

    const openUpdateModal = (order) => {
        setSelectedOrder(order);
        setUpdateData({
            status: order.orderStatus,
            note: '',
            trackingNumber: order.trackingInfo?.trackingNumber || '',
            courier: order.trackingInfo?.courier || '',
            trackingUrl: order.trackingInfo?.trackingUrl || ''
        });
        setShowModal(true);
        setMsg({ error: '', success: '' });
    }

    const handleUpdateOrder = async (e) => {
        e.preventDefault();

        if (!updateData.status) {
            setMsg({ error: 'Please select order status', success: '' });
            return;
        }

        // Confirm destructive actions
        if (
            ['cancelled', 'returned'].includes(updateData.status) &&
            !window.confirm(`Are you sure you want to mark this order as "${updateData.status}"?`)
        ) {
            return;
        }

        try {
            setUpdating(true);
            setMsg({ error: '', success: '' });
            await updateOrderStatus(selectedOrder._id, updateData);

            setMsg({ error: '', success: 'Order updated successfully' });
            fetchOrders();
            setTimeout(() => {
                setShowModal(false);
                setSelectedOrder(null);
            }, 1200);
            
        } catch (err) {
            setMsg({
                error: err.response?.data?.message || 'Failed to update order',
                success: ''
            });
        } finally {
            setUpdating(false);
        }
    }

    const getStatusBadge = (status) => {
        const statusColors = {
            pending: '#fbbf24',
            confirmed: '#3b82f6',
            processing: '#8b5cf6',
            shipped: '#06b6d4',
            'out-for-delivery': '#f97316',
            delivered: '#22c55e',
            cancelled: '#ef4444',
            returned: '#64748b'
        };
        return { backgroundColor: statusColors[status] || '#94a3b8', color: 'white' };
    };

    // LOADING SKELETON
    // =======================
    const TableSkeleton = () => (
        [...Array(6)].map((_, i) => (
            <tr key={i}>
                <td colSpan="8" className="skeleton-row"></td>
            </tr>
        ))
    );

    return (
        <div className="orders-management">
            <h1>Orders Management</h1>

            {msg.error && <div className="alert alert-error">{msg.error}</div>}
            {msg.success && <div className="alert alert-success">{msg.success}</div>}

            {/* Filters */}
            <div className="filters-bar">
                <div className="search-box">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Search by order number..."
                        onChange={(e) => handleSearchChange(e.target.value)}
                    />
                </div>

                <select
                    value={filters.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                >
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="out-for-delivery">Out for Delivery</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="returned">Returned</option>
                </select>
            </div>

            <div className="orders-table-container">
                <table className="orders-table">

                    <thead>
                        <tr>
                            <th>Order</th>
                            <th>Customer</th>
                            <th>Items</th>
                            <th>Amount</th>
                            <th>Payment</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {
                            loading ? (
                                <TableSkeleton />
                            ) : (
                                orders.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>
                                            No orders found
                                        </td>
                                    </tr>
                                ) : (
                                    orders.map((order) => (
                                        <tr key={order._id}>
                                            <td className="order-id">{order.orderNumber}</td>
                                            <td>
                                                <div className="customer-info">
                                                    <strong>{order.user?.fullname || 'N/A'}</strong>
                                                    <span>{order.user?.email || 'N/A'}</span>
                                                </div>
                                            </td>
                                            <td>{order.items.length}</td>
                                            <td className="amount">₹{order.pricing.total.toFixed(2)}</td>
                                            <td>
                                                <span className="payment-badge">{order.paymentInfo.method}</span>
                                            </td>
                                            <td>
                                                <span
                                                    className="status-badge"
                                                    style={getStatusBadge(order.orderStatus)}
                                                >
                                                    {order.orderStatus}
                                                </span>
                                            </td>
                                            <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                            <td>
                                                <button
                                                    className="action-btn-admin"
                                                    onClick={() => openUpdateModal(order)}
                                                >
                                                    <Eye size={16} />
                                                    Manage
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )
                            )
                        }
                    </tbody>
                </table>
            </div>

            {
                pagination.totalPages > 1 && (
                    <div className="pagination">
                        <button disabled={pagination.page === 1} onClick={() => handlePageChange(pagination.page - 1)}>
                            Previous
                        </button>
                        <span>Page {pagination.page} of {pagination.totalPages}</span>
                        <button disabled={pagination.page === pagination.totalPages} onClick={() => handlePageChange(pagination.page + 1)}>
                            Next
                        </button>
                    </div>
                )
            }

            {
                showModal && selectedOrder && (
                    <div className="modal-overlay" onClick={() => setShowModal(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>Update Order</h2>
                                <button className='close-btn' onClick={() => setShowModal(false)}>
                                    <X size={20} />
                                </button>
                            </div>

                            <p className="order-number">Order: {selectedOrder.orderNumber}</p>

                            {msg.error && <div className="alert alert-error">{msg.error}</div>}
                            {msg.success && <div className="alert alert-success">{msg.success}</div>}

                            <form onSubmit={handleUpdateOrder}>
                                <div className="form-group-modal">
                                    <label>Order Status *</label>
                                    <select value={updateData.status}
                                        onChange={(e) => setUpdateData({ ...updateData, status: e.target.value })}
                                        >

                                        <option value="">Select Status</option>
                                        <option value="pending">Pending</option>
                                        <option value="confirmed">Confirmed</option>
                                        <option value="processing">Processing</option>
                                        <option value="shipped">Shipped</option>
                                        <option value="out-for-delivery">Out for Delivery</option>
                                        <option value="delivered">Delivered</option>
                                        <option value="cancelled">Cancelled</option>
                                        <option value="returned">Returned</option>
                                    </select>
                                </div>

                                <div className="form-group-modal">
                                    <label>Tracking Number</label>
                                    <input
                                        type="text"
                                        placeholder="Enter tracking number"
                                        value={updateData.trackingNumber}
                                        onChange={(e) => setUpdateData({ ...updateData, trackingNumber: e.target.value })}
                                    />
                                </div>

                                <div className="form-group-modal">
                                    <label>Courier</label>
                                    <input
                                        type="text"
                                        placeholder="e.g., FedEx, DHL"
                                        value={updateData.courier}
                                        onChange={(e) => setUpdateData({ ...updateData, courier: e.target.value })}
                                    />
                                </div>

                                <div className="form-group-modal">
                                    <label>Tracking URL</label>
                                    <input
                                        type="url"
                                        placeholder="https://..."
                                        value={updateData.trackingUrl}
                                        onChange={(e) => setUpdateData({ ...updateData, trackingUrl: e.target.value })}
                                    />
                                </div>

                                <div className="form-group-modal">
                                    <label>Note</label>
                                    <textarea
                                        rows="3"
                                        placeholder="Add a note (optional)"
                                        value={updateData.note}
                                        onChange={(e) => setUpdateData({ ...updateData, note: e.target.value })}
                                    />
                                </div>

                                <div className="modal-actions">
                                    <button
                                        type="button"
                                        className="btn-cancel"
                                        onClick={() => setShowModal(false)}
                                        disabled={updating}
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn-submit" disabled={updating}>
                                        {updating ? 'Updating...' : 'Update Order'}
                                    </button>
                                </div>
                            </form>
                        </div>

                    </div>

                )
            }

        </div >
    );
}