import { useEffect, useState } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import { getOrderById } from '../api/orderservice';
import './OrderConfirmation.css';
import { useProducts } from '../context/FurnitureProductsProvider';

function OrderConfirmation() {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    const { setCartItems, clearCart } = useProducts();

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await getOrderById(orderId);
                setOrder(response.data);

                // Clear local cart
                await clearCart();
            } catch (error) {
                console.error('Error fetching order:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [orderId]);

    if (loading) return <div className="loading">Loading...</div>;
    if (!order) return <div className="error">Order not found</div>;

    return (
        <div className="order-confirmation-page">
            <div className="container ordercon-container">
                <div className="success-icon">✓</div>
                <h1>Order Placed Successfully!</h1>
                <p className="order-number">Order #{order.orderNumber}</p>

                {/* Payment Status */}
                {order.paymentInfo.method === 'razorpay' && (
                    <div className="payment-status">
                        <p className="payment-success">
                            ✓ Payment Received (₹{order.pricing.total.toLocaleString()})
                        </p>
                        <p className="payment-id">Payment ID: {order.paymentInfo.razorpayPaymentId}</p>
                    </div>
                )}

                {order.paymentInfo.method === 'cod' && (
                    <div className="payment-status">
                        <p className="payment-cod">
                            💵 Cash on Delivery (₹{order.pricing.total.toLocaleString()})
                        </p>
                    </div>
                )}

                <div className="confirmation-content">
                    <div className="order-details">
                        <h2>Order Details</h2>
                        <div className="order-items">
                            {order.items.map((item, index) => (
                                <div key={index} className="order-item">
                                    <img src={item.image} alt={item.name} />
                                    <div>
                                        <p>{item.name}</p>
                                        <p>Qty: {item.quantity} × ₹{item.price.toLocaleString()}</p>
                                    </div>
                                    <p className="item-total">₹{(item.price * item.quantity).toLocaleString()}</p>
                                </div>
                            ))}
                        </div>

                        <div className="order-pricing">
                            <div className="price-row">
                                <span>Subtotal</span>
                                <span>₹{order.pricing.subtotal.toLocaleString()}</span>
                            </div>
                            <div className="price-row">
                                <span>Tax</span>
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

                    <div className="shipping-info">
                        <h2>Shipping Address</h2>
                        <p>{order.shippingAddress.fullName}</p>
                        <p>{order.shippingAddress.phone}</p>
                        <p>{order.shippingAddress.addressLine1}</p>
                        {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                        <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                        <p>{order.shippingAddress.pincode}</p>
                    </div>
                </div>

                <div className="action-buttons">
                    <NavLink to="/my-orders" className="btn-primary">View My Orders</NavLink>
                    <NavLink to="/collections/all" className="btn-secondary">Continue Shopping</NavLink>
                </div>
            </div>
        </div>
    );
}

export default OrderConfirmation;
