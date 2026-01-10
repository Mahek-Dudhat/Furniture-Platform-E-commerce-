import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../context/FurnitureProductsProvider';
import { useAuth } from '../context/AuthContext';
import { createOrder, createRazorpayOrder } from '../api/orderservice';
import { applyCoupon } from '../api/couponservice';
import './Checkout.css';
import Alert from '@mui/material/Alert';

function Checkout() {
    const navigate = useNavigate();
    const { cartItems, getCartTotal, setCartItems, clearCart } = useProducts();
    const { user } = useAuth();

    const [shippingAddress, setShippingAddress] = useState({
        fullName: user?.fullname || '',
        phone: user?.phoneno || '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        pincode: '',
        landmark: ''
    });

    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponError, setCouponError] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const subtotal = getCartTotal();
    const discount = appliedCoupon?.discount || 0;
    const tax = subtotal * 0.18;
    const shippingCharge = subtotal > 10000 ? 0 : 500;
    const total = subtotal + tax + shippingCharge - discount;

    const handleInputChange = (e) => {
        setShippingAddress({
            ...shippingAddress,
            [e.target.name]: e.target.value
        });
    };

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) {
            setCouponError('Please enter a coupon code');
            return;
        }

        try {
            setCouponError('');
            const response = await applyCoupon(couponCode);
            if (response.success) {
                setAppliedCoupon(response.data);
                setCouponError('');
            }
        } catch (err) {
            setCouponError(err.message || 'Invalid coupon code');
            setAppliedCoupon(null);
        }
    };

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        setCouponCode('');
        setCouponError('');
    };

    const handleRazorpayPayment = async () => {
        try {
            setLoading(true);
            setError('');

            // Step 1: Create Razorpay order
            const razorpayOrderResponse = await createRazorpayOrder(total);

            if (!razorpayOrderResponse.success) {
                throw new Error('Failed to create payment order');
            }

            const { orderId, amount, currency, keyId } = razorpayOrderResponse.data;

            // Step 2: Configure Razorpay options
            const options = {
                key: keyId,
                amount: amount,
                currency: currency,
                name: 'Aura Vista Furniture',
                description: 'Furniture Purchase',
                order_id: orderId,
                prefill: {
                    name: user?.fullname || shippingAddress.fullName,
                    email: user?.email || '',
                    contact: shippingAddress.phone
                },
                theme: {
                    color: '#8B6F47'
                },
                handler: async function (response) {
                    try {
                        // Create order with payment details
                        const orderData = {
                            shippingAddress,
                            paymentMethod: 'razorpay',
                            couponCode: appliedCoupon?.code || undefined,
                            razorpayOrderId: response.razorpay_order_id,
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpaySignature: response.razorpay_signature
                        };

                        const orderResponse = await createOrder(orderData);

                        if (orderResponse.success) {
                            // Redirect to success page
                            navigate(`/order-confirmation/${orderResponse.data.orderNumber}`);

                        }
                    } catch (err) {
                        setError(err.message || 'Failed to complete order');
                        setLoading(false);
                    }
                },
                // Step 4: Handle payment failure
                modal: {
                    ondismiss: function () {
                        setError('Payment cancelled. Please try again.');
                        setLoading(false);
                    }
                }
            }
            // Step 5: Open Razorpay checkout
            const razorpay = new window.Razorpay(options);
            razorpay.open();

        } catch (err) {
            setError(err.message || 'Failed to initiate payment');
            setLoading(false);
        }
    }

    // COD ORDER HANDLER
    const handleCODOrder = async () => {
        try {
            setLoading(true);
            setError('');

            const orderData = {
                shippingAddress,
                paymentMethod,
                couponCode: appliedCoupon?.code || undefined
            }

            const response = await createOrder(orderData);

            if (response.success) {
                navigate(`/order-confirmation/${response.data.orderNumber}`);

            }
        } catch (err) {
            setError(err.message || 'Failed to place order');
        } finally {
            setLoading(false);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form
        if (!shippingAddress.fullName || !shippingAddress.phone ||
            !shippingAddress.addressLine1 || !shippingAddress.city ||
            !shippingAddress.state || !shippingAddress.pincode) {
            setError('Please fill in all required fields');
            return;
        }

        if (paymentMethod === 'razorpay') {
            handleRazorpayPayment();
        } else {
            handleCODOrder();
        }
    };

    if (cartItems.length === 0) {
        navigate('/cart');
        return null;
    }

    return (
        <div className="checkout-page">
            <div className="checkout-container container">
                <h1>Checkout</h1>

                {error && <Alert severity="error">{error}</Alert>}

                <div className="checkout-content">
                    <form onSubmit={handleSubmit} className="checkout-form">
                        <div className="form-section">
                            <h2>Shipping Address</h2>
                            <input
                                type="text"
                                name="fullName"
                                placeholder="Full Name"
                                value={shippingAddress.fullName}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                type="tel"
                                name="phone"
                                placeholder="Phone Number"
                                value={shippingAddress.phone}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                type="text"
                                name="addressLine1"
                                placeholder="Address Line 1"
                                value={shippingAddress.addressLine1}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                type="text"
                                name="addressLine2"
                                placeholder="Address Line 2 (Optional)"
                                value={shippingAddress.addressLine2}
                                onChange={handleInputChange}
                            />
                            <div className="form-row">
                                <input
                                    type="text"
                                    name="city"
                                    placeholder="City"
                                    value={shippingAddress.city}
                                    onChange={handleInputChange}
                                    required
                                />
                                <input
                                    type="text"
                                    name="state"
                                    placeholder="State"
                                    value={shippingAddress.state}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <input
                                type="text"
                                name="pincode"
                                placeholder="Pincode"
                                value={shippingAddress.pincode}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                type="text"
                                name="landmark"
                                placeholder="Landmark (Optional)"
                                value={shippingAddress.landmark}
                                onChange={handleInputChange}
                            />
                        </div>

                        {/* Payment Method Section */}
                        <div className="form-section">
                            <h2>Payment Method</h2>
                            <label className="payment-option">
                                <input
                                    type="radio"
                                    name="payment"
                                    value="cod"
                                    checked={paymentMethod === 'cod'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                />
                                <span>💵 Cash on Delivery</span>
                            </label>
                            <label className="payment-option">
                                <input
                                    type="radio"
                                    name="payment"
                                    value="razorpay"
                                    checked={paymentMethod === 'razorpay'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                />
                                <span>💳 Pay Online (Card/UPI/Netbanking)</span>
                            </label>
                            {paymentMethod === 'razorpay' && (
                                <div className="payment-info">
                                    <p>✓ Secure payment powered by Razorpay</p>
                                    <p>✓ Supports Credit/Debit Cards, UPI, Netbanking</p>
                                </div>
                            )}
                        </div>

                        <div className="form-section">
                            <h2>Apply Coupon</h2>
                            <div className="coupon-input-group">
                                <input
                                    type="text"
                                    placeholder="Enter coupon code"
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                    disabled={appliedCoupon}
                                />
                                {!appliedCoupon ? (
                                    <button type="button" onClick={handleApplyCoupon} className="apply-coupon-btn">
                                        Apply
                                    </button>
                                ) : (
                                    <button type="button" onClick={handleRemoveCoupon} className="remove-coupon-btn">
                                        Remove
                                    </button>
                                )}
                            </div>
                            {couponError && <p className="coupon-error">{couponError}</p>}
                            {appliedCoupon && (
                                <p className="coupon-success">
                                    ✓ Coupon applied! You saved ₹{appliedCoupon.discount}
                                </p>
                            )}
                        </div>

                        <button type="submit" className="place-order-btn" onClick={handleSubmit} disabled={loading}>
                            {loading ? 'Placing Order...' : 'Place Order'}
                        </button>
                    </form>

                    <div className="order-summary">
                        <h2>Order Summary</h2>
                        <div className="summary-items">
                            {cartItems.map(item => (
                                <div key={item.productId} className="summary-item">
                                    <img src={item.images[0]?.url} alt={item.name} />
                                    <div>
                                        <p>{item.name}</p>
                                        <p>Qty: {item.quantity}</p>
                                    </div>
                                    <p>₹{(item.price * item.quantity).toLocaleString()}</p>
                                </div>
                            ))}
                        </div>
                        <div className="summary-pricing">
                            <div className="summary-row">
                                <span>Subtotal</span>
                                <span>₹{subtotal.toLocaleString()}</span>
                            </div>
                            {appliedCoupon && (
                                <div className="summary-row discount">
                                    <span>Discount ({appliedCoupon.code})</span>
                                    <span>-₹{discount.toLocaleString()}</span>
                                </div>
                            )}
                            <div className="summary-row">
                                <span>Tax (18% GST)</span>
                                <span>₹{tax.toFixed(2)}</span>
                            </div>
                            <div className="summary-row">
                                <span>Shipping</span>
                                <span>{shippingCharge === 0 ? 'FREE' : `₹${shippingCharge}`}</span>
                            </div>
                            <div className="summary-total">
                                <span>Total</span>
                                <span>₹{total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Checkout;
