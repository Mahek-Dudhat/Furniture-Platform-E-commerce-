import { useEffect, useState } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import { getOrderById } from '../api/orderservice';
import OrderTracker from '../components/order/OrderTracker';
import './OrderDetails.css';

function OrderDetails() {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await getOrderById(orderId);
                setOrder(response.data);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [orderId]);

    if (loading) return <div className="loading">Loading...</div>;
    if (!order) return <div className="error">Order not found</div>;

    return (
        <div className="order-details-page">
            <div className="container">
                <NavLink to="/my-orders" className="back-link">← Back to Orders</NavLink>

                <div className="order-header-section">
                    <h1>Order #{order.orderNumber}</h1>
                    <span className={`status-badge ${order.orderStatus}`}>
                        {order.orderStatus.toUpperCase()}
                    </span>
                </div>

                <OrderTracker 
                    currentStatus={order.orderStatus} 
                    statusHistory={order.statusHistory} 
                />

                <div className="order-timeline">
                    <h2>Order Status Timeline</h2>
                    <div className="timeline">
                        {order.statusHistory.map((status, index) => (
                            <div key={index} className="timeline-item">
                                <div className="timeline-dot"></div>
                                <div className="timeline-content">
                                    <p className="timeline-status">{status.status.toUpperCase()}</p>
                                    <p className="timeline-date">
                                        {new Date(status.timestamp).toLocaleString('en-IN')}
                                    </p>
                                    {status.note && <p className="timeline-note">{status.note}</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="order-content-grid">
                    <div className="order-items-section">
                        <h2>Order Items</h2>
                        {order.items.map((item, index) => (
                            <div key={index} className="detail-item">
                                <img src={item.image} alt={item.name} />
                                <div className="detail-item-info">
                                    <h3>{item.name}</h3>
                                    <p>Quantity: {item.quantity}</p>
                                    <p>Price: ₹{item.price.toLocaleString()}</p>
                                </div>
                                <p className="detail-item-total">
                                    ₹{(item.price * item.quantity).toLocaleString()}
                                </p>
                            </div>
                        ))}

                        <div className="pricing-breakdown">
                            <div className="price-row">
                                <span>Subtotal</span>
                                <span>₹{order.pricing.subtotal.toLocaleString()}</span>
                            </div>
                            <div className="price-row">
                                <span>Tax (GST)</span>
                                <span>₹{order.pricing.tax.toFixed(2)}</span>
                            </div>
                            <div className="price-row">
                                <span>Shipping</span>
                                <span>₹{order.pricing.shippingCharge}</span>
                            </div>
                            <div className="price-total">
                                <span>Total</span>
                                <span>₹{order.pricing.total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="order-info-section">
                        <div className="order-info-card">
                            <h2>Shipping Address</h2>
                            <p>{order.shippingAddress.fullName}</p>
                            <p>{order.shippingAddress.phone}</p>
                            <p>{order.shippingAddress.addressLine1}</p>
                            {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                            <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                            <p>{order.shippingAddress.pincode}</p>
                        </div>

                        <div className="order-info-card">
                            <h2>Payment Information</h2>
                            <p>Method: {order.paymentInfo.method.toUpperCase()}</p>
                            <p>Status: {order.paymentInfo.status.toUpperCase()}</p>
                            {order.paymentInfo.paidAt && (
                                <p>Paid on: {new Date(order.paymentInfo.paidAt).toLocaleDateString('en-IN')}</p>
                            )}
                        </div>

                        <div className="order-info-card">
                            <h2>Order Date</h2>
                            <p>{new Date(order.createdAt).toLocaleString('en-IN', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderDetails;
