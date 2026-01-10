import { useEffect } from 'react';
import { createContext, useContext, useState } from 'react'
import { getAllProducts } from '../api/productservice';
import { useAuth } from './AuthContext';
import { syncCart, updateCart, getCart } from '../api/cartservice';


const ProductsContext = createContext();

export const useProducts = () => {
  const context = useContext(ProductsContext)
  if (!context) {
    throw new Error('useProducts must be used within ProductsProvider')
  }
  return context;
}

function FurnitureProductsProvider({ children }) {

  const [error, setError] = useState('');
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [customerFavorites, setCustomerFavorites] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [products, setProducts] = useState([]);

  const { isAuthenticated } = useAuth();
  const [hasInitialSync, setHasInitialSync] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await getAllProducts();
        if (response.success) {
          setCustomerFavorites(response.data);
          setProducts(response.data);
          setNewArrivals(response.data.slice(-5));
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err.message || 'Failed to load products');
      }
    }

    loadProducts();
  }, [])

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Clear cart on logout
  useEffect(() => {
    if (isAuthenticated === false && hasInitialSync) {
      setCartItems([]);
      setHasInitialSync(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const syncUserCart = async () => {
      if (!isAuthenticated || hasInitialSync) return;

      setHasInitialSync(true);

      try {
        const response = await getCart();

        if (response.success && response.data.items?.length > 0) {
          const serverItems = response.data.items.map((item) => ({
            productId: item.product._id,
            name: item.product.name,
            price: item.price,
            images: item.product.images,
            category: item.product.category,
            quantity: item.quantity
          }));
          setCartItems(serverItems);
        } else if (cartItems.length > 0) {
          // If server has no cart but localStorage has items, sync them
          await updateCart(cartItems);
        }
      } catch (err) {
        console.error("Error loading cart:", err);
      }
    };

    syncUserCart();
  }, [isAuthenticated, hasInitialSync])

  const addToCart = async (product) => {
    console.log("Adding to cart:", product);

    // Normalize product data
    const cartProduct = {
      productId: product._id || product.productId,
      name: product.name,
      price: product.price,
      images: product.images,
      category: product.category,
      quantity: 1
    };

    let updatedCart;
    setCartItems((prev) => {
      const existingItem = prev.find(item => item.productId === cartProduct.productId);
      if (existingItem) {
        updatedCart = prev.map((item) =>
          item.productId === cartProduct.productId ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        updatedCart = [...prev, cartProduct];
      }
      return updatedCart;
    });

    setIsCartOpen(true);

    if (isAuthenticated && updatedCart) {
      try {
        await updateCart(updatedCart);
      } catch (err) {
        console.error("Error adding to cart:", err);
      }
    }
  }

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;

    let updatedCart;
    setCartItems((prev) => {
      updatedCart = prev.map((item) => item.productId === productId ? { ...item, quantity } : item);
      return updatedCart;
    });

    if (isAuthenticated && updatedCart) {
      try {
        await updateCart(updatedCart);
      } catch (err) {
        console.error("Error updating quantity:", err);
      }
    }
  }

  const removeFromCart = async (productId) => {
    let updatedCart;
    setCartItems((prev) => {
      updatedCart = prev.filter((item) => item.productId !== productId);
      return updatedCart;
    });

    if (isAuthenticated && updatedCart) {
      try {
        await updateCart(updatedCart);
      } catch (err) {
        console.error("Error removing from cart:", err);
      }
    }
  }

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0)
  }

  const clearCart = async () => {
    try {
      // 1️⃣ Clear cart in React state (UI update)
      setCartItems([]);

      // 2️⃣ Clear cart from localStorage (guest cart)
      localStorage.removeItem('cart');

    } catch (error) {
      console.error('Failed to clear cart:', error);
    }
  }

  return (
    <ProductsContext.Provider value={{ products, customerFavorites, newArrivals, cartItems, setCartItems, addToCart, clearCart, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, getCartTotal, getCartCount }}>
      {children}
    </ProductsContext.Provider>
  )
}

export default FurnitureProductsProvider
