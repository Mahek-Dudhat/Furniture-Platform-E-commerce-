import { useEffect, useState } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import { getOrderById } from '../api/orderservice';
import OrderTracker from '../components/order/OrderTracker';
import './TrackOrder.css';

function TrackOrder() {
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

    const getEstimatedDelivery = () => {
        if (order.orderStatus === 'delivered') return null;
        if (order.orderStatus === 'cancelled') return null;
        
        const orderDate = new Date(order.createdAt);
        const estimatedDate = new Date(orderDate);
        estimatedDate.setDate(orderDate.getDate() + 7);
        
        return estimatedDate.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <div className="track-order-page">
            <div className="container">
                <NavLink to="/my-orders" className="back-link">← Back to Orders</NavLink>

                <div className="track-header">
                    <h1>Track Your Order</h1>
                    <p className="order-number">Order #{order.orderNumber}</p>
                </div>

                <OrderTracker 
                    currentStatus={order.orderStatus} 
                    statusHistory={order.statusHistory} 
                />

                <div className="track-info-grid">
                    <div className="track-card">
                        <h3>Delivery Address</h3>
                        <p>{order.shippingAddress.fullName}</p>
                        <p>{order.shippingAddress.addressLine1}</p>
                        {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                        <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                        <p>Phone: {order.shippingAddress.phone}</p>
                    </div>

                    {getEstimatedDelivery() && (
                        <div className="track-card">
                            <h3>Estimated Delivery</h3>
                            <p className="delivery-date">{getEstimatedDelivery()}</p>
                        </div>
                    )}

                    <div className="track-card">
                        <h3>Order Summary</h3>
                        <p>{order.items.length} item(s)</p>
                        <p className="total-amount">Total: ₹{order.pricing.total.toFixed(2)}</p>
                    </div>
                </div>

                <div className="track-items">
                    <h3>Items in this order</h3>
                    <div className="items-grid">
                        {order.items.map((item, index) => (
                            <div key={index} className="track-item">
                                <img src={item.image} alt={item.name} />
                                <div className="track-item-info">
                                    <p className="item-name">{item.name}</p>
                                    <p className="item-qty">Qty: {item.quantity}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TrackOrder;
