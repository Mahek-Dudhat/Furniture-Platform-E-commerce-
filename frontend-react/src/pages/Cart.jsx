import { useProducts } from '../context/FurnitureProductsProvider';
import './Cart.css';
import { NavLink } from 'react-router-dom';

function Cart() {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useProducts();

  const handleInputChange = (productId, event) => {
    const newQuantity = parseInt(event.target.value, 10);
    if (newQuantity > 0) {
      updateQuantity(productId, newQuantity);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="empty-cart-page">
        <h2>Your Cart is Empty</h2>
        <p>Add some products to get started!</p>
        <NavLink to="/collections/all" className="continue-shopping">Continue Shopping</NavLink>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1>Shopping Cart</h1>
        <div className="cart-content">
          <div className="cart-items-section">
            {cartItems.map(item => (
              <div key={item.productId} className="cart-item">
                <img src={item.images[0]?.url} alt={item.name} />
                <div className="cart-item-info">
                  <h3>{item.name}</h3>
                  <p className="cart-item-category">{item.category}</p>
                  <p className="cart-item-price">₹{item.price.toLocaleString()}</p>
                </div>
                <div className="cart-item-actions">
                  <div className="quantity-selector">
                    <button onClick={() => updateQuantity(item.productId, item.quantity - 1)}>−</button>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleInputChange(item.productId, e)}
                      min="1"
                    />
                    <button onClick={() => updateQuantity(item.productId, item.quantity + 1)}>+</button>
                  </div>
                  <p className="item-total">₹{(item.price * item.quantity).toLocaleString()}</p>
                  <button className="remove-item" onClick={() => removeFromCart(item.productId)}>Remove</button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2>Order Summary</h2>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{getCartTotal().toLocaleString()}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>
            <div className="summary-total">
              <span>Total</span>
              <span>₹{getCartTotal().toLocaleString()}</span>
            </div>
            <NavLink to="/checkout" className="checkout-button">Proceed to Checkout</NavLink>
            <NavLink to="/collections/all" className="continue-link">Continue Shopping</NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
