import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css'
import Home from './pages/Home'
import AppLayout from './components/layouts/AppLayout';
import Products from './pages/Products';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import ProductDetail from './pages/ProductDetail';
import BackToTop from './components/ui/BackToTop';
import Login from './pages/Login';
import Registration from './pages/Registration';
import VerifyEmail from './pages/VerifyEmail';
import VerificationPending from './pages/VerificationPending';
import ResendVerification from './pages/ResendVerification';
import GoogleAuthSuccess from './pages/GoogleAuthSuccess';
import NotFound from './pages/NotFound';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import MyOrders from './pages/MyOrders';
import OrderDetails from './pages/OrderDetails';
import TrackOrder from './pages/TrackOrder';
import Profile from './pages/Profile';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLayout from './components/layouts/AdminLayout';
import ProductManagement from './pages/admin/ProductManagement';
import UserManagement from './pages/admin/UserManagement';
import CouponManagement from './pages/admin/CouponManagement';
import OrdersManagement from './pages/admin/OrdersManagement';

function App() {

  const router = createBrowserRouter([
    {
      path: '/',
      element: <AppLayout />,
      errorElement: <NotFound />,
      children: [
        {
          path: '/',
          element: <Home />
        },
        {
          path: '/collections/all',
          element: <Products />
        },
        {
          path: '/collections/:category',
          element: <Products />,
        },
        {
          path: '/blog',
          element: <Blog />
        },
        {
          path: '/blog/:blogId',
          element: <BlogDetail />
        },
        {
          path: '/contact',
          element: <Contact />
        },
        {
          path: '/cart',
          element: <Cart />
        },
        {
          path: '/product/:productId',
          element: <ProductDetail />
        },
        {
          path: '/login',
          element: <Login />,
        },
        {
          path: '/register',
          element: <Registration />
        },
        {
          path: '/verify-email/:token',
          element: <VerifyEmail />
        },
        {
          path: '/verification-pending',
          element: <VerificationPending />
        },
        {
          path: '/resend-verification',
          element: <ResendVerification />
        }
        ,
        {
          path: '/auth/google/success',
          element: <GoogleAuthSuccess />
        },
        {
          path: '/checkout',
          element: <Checkout />
        },
        {
          path: 'order-confirmation/:orderId',
          element: <OrderConfirmation />
        },
        {
          path: '/my-orders',
          element: <MyOrders />
        },
        {
          path: '/order/:orderId',
          element: <OrderDetails />
        },
        {
          path: '/track-order/:orderId',
          element: <TrackOrder />
        },
        {
          path: '/profile',
          element: <Profile />
        }
      ]
    },
    {
      path: '/admin',
      element: <AdminLayout />,
      children: [
        {
          path: '/admin',
          element: <AdminDashboard />
        },
        {
          path: '/admin/dashboard',
          element: <AdminDashboard />
        },
        {
          path: '/admin/products',
          element: <ProductManagement />
        },
        {
          path: '/admin/orders',
          element: <OrdersManagement />
        },
        {
          path: '/admin/users',
          element: <UserManagement />
        },
        {
          path: '/admin/coupons',
          element: <CouponManagement />
        }
      ]
    }, {
      path: '*',
      element: <NotFound />
    }
  ])

  return (
    <>
      <RouterProvider router={router} />
      <BackToTop />
    </>
  )
}

export default App
