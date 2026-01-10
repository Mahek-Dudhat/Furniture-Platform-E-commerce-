import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Package } from 'lucide-react';
import { getUserOrders, cancelOrder } from '../api/orderservice';
import './MyOrders.css';
import Alert from '@mui/material/Alert';

function MyOrders() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [msg, setMsg] = useState(false);
    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await getUserOrders();
            setOrders(response.data);
        } catch (err) {
            setError('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOrder = async (orderId) => {
        if (!window.confirm('Are you sure you want to cancel this order?')) return;

        try {
            const res = await cancelOrder(orderId, 'Cancelled by user');
            if (res.success) {
                setMsg(res.message);
                const timeOut = setTimeout(() => {
                    setMsg(false)
                    clearTimeout(timeOut)
                }, 5000)
            }

            fetchOrders(); // Refresh orders
        } catch (err) {
            alert('Failed to cancel order');
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: '#ff9800',
            confirmed: '#2196f3',
            processing: '#9c27b0',
            shipped: '#00bcd4',
            delivered: '#4caf50',
            cancelled: '#f44336'
        };
        return colors[status] || '#666';
    };

    if (loading) return <div className="loading">Loading orders...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="my-orders-page">
            <div className="container myorders-container">
                <h1>My Orders</h1>

                {msg && <Alert severity="success">{msg}</Alert>}
                {orders.length === 0 ? (
                    <div className="no-orders">
                        <p>You haven't placed any orders yet</p>
                        <NavLink to="/collections/all" className="shop-now-btn">Start Shopping</NavLink>
                    </div>
                ) : (
                    <div className="orders-list">
                        {orders.map(order => (
                            <div key={order._id} className="order-card">
                                <div className="order-header">
                                    <div>
                                        <h3>Order #{order.orderNumber}</h3>
                                        <p className="order-date">
                                            Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                    <div className="order-status" style={{ background: getStatusColor(order.orderStatus) }}>
                                        {order.orderStatus.toUpperCase()}
                                    </div>
                                </div>

                                <div className="order-items">
                                    {order.items.map((item, index) => (
                                        <div key={index} className="order-item">
                                            <img src={item.image} alt={item.name} />
                                            <div className="item-info">
                                                <p className="item-name">{item.name}</p>
                                                <p className="item-qty">Quantity: {item.quantity}</p>
                                                <p className="item-price">₹{item.price.toLocaleString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="order-footer">
                                    <div className="order-total">
                                        <span>Total Amount:</span>
                                        <span className="total-price">₹{order.pricing.total.toFixed(2)}</span>
                                    </div>
                                <div className="order-actions">
                                        <NavLink to={`/order/${order.orderNumber}`} className="view-details-btn">
                                            View Details
                                        </NavLink>
                                        <button 
                                            onClick={() => navigate(`/track-order/${order.orderNumber}`)}
                                            className="track-btn"
                                        >
                                            <Package size={16} /> Track Order
                                        </button>
                                        {['pending', 'confirmed'].includes(order.orderStatus) && (
                                            <button
                                                onClick={() => handleCancelOrder(order._id)}
                                                className="cancel-btn"
                                            >
                                                Cancel Order
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default MyOrders;
