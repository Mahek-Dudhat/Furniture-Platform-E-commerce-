import './MiniCart.css';
import { useProducts } from "../../context/FurnitureProductsProvider";
import { NavLink, useNavigate } from 'react-router-dom';


function MiniCart() {

  const { cartItems, isCartOpen, updateQuantity, removeFromCart, setIsCartOpen, getCartTotal } = useProducts();

  if (!isCartOpen) return null;

  return (
    <>
      <div className="mini-cart-overlay" onClick={() => setIsCartOpen(false)}></div>
      <div className={`mini-cart ${isCartOpen ? 'open' : ''}`}>
        <div className="mini-cart-header">
          <h3>Cart ({cartItems.length})</h3>
          <button className="close-btn" onClick={() => setIsCartOpen(false)}>✕</button>
        </div>

        <div className="mini-cart-items">
          {cartItems.length === 0 ? (
            <p className="empty-cart">Your cart is empty</p>
          ) : (
            cartItems.map(item => (

              <div key={item.productId} className="mini-cart-item">
                <img src={item.images[0]?.url} alt={item.name} />
                <div className="item-details">
                  <h4>{item.name}</h4>
                  <p className="item-price">₹{item.price} x {item.quantity}</p>
                  <div className="quantity-controls">
                    <button onClick={() => updateQuantity(item.productId, item.quantity - 1)}>−</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.productId, item.quantity + 1)}>+</button>
                  </div>
                </div>
                <button className="remove-btn" onClick={() => removeFromCart(item.productId)}>Remove</button>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="mini-cart-footer">
            <div className="cart-total">
              <span>Total:</span>
              <span className="total-amount">₹{getCartTotal().toLocaleString()}</span>
            </div>
            <NavLink to='/cart' onClick={() => setIsCartOpen(false)}> <button className="view-cart-btn" >VIEW CART</button></NavLink>
            <NavLink to='/checkout' onClick={() => setIsCartOpen(false)}> <button className="checkout-btn" >CHECK OUT</button></NavLink>
          </div>
        )}
      </div>
    </>
  );
}

export default MiniCart;
