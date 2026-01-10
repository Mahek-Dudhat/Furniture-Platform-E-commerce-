import { useEffect, useState } from 'react';
import { Outlet, NavLink, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Package, ShoppingCart, Users, Tag, LogOut, Menu, X } from 'lucide-react';
import './AdminLayout.css';

export default function AdminLayout() {

    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    if (!user || user.role !== 'admin') {
        return <Navigate to='/login' replace />;
    }

    const handleLogout = () => {
        logout();
        navigate('/login');
    }

    const navItems = [
        { path: '/admin/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
        { path: '/admin/products', icon: <Package size={20} />, label: 'Products' },
        { path: '/admin/orders', icon: <ShoppingCart size={20} />, label: 'Orders' },
        { path: '/admin/users', icon: <Users size={20} />, label: 'Users' },
        { path: '/admin/coupons', icon: <Tag size={20} />, label: 'Coupons' }
    ];

    return (
        <div className="admin-layout">
            <aside className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
                <div className="sidebar-header">
                    <h2>{sidebarOpen ? 'Admin Panel' : 'AP'}</h2>
                    <button className="toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
                        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                <nav className="sidebar-nav">
                    {navItems.map(item => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                        >
                            {item.icon}
                            {sidebarOpen && <span>{item.label}</span>}
                        </NavLink>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <button className="logout-btn" onClick={handleLogout}>
                        <LogOut size={20} />
                        {sidebarOpen && <span>Logout</span>}
                    </button>
                </div>
            </aside>

            <main className={`admin-main ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
                <div className="admin-header">
                    <h3>Welcome, {user?.fullname}</h3>
                    <div className="user-info">
                        <span>{user?.email}</span>
                    </div>
                </div>
                <div className="admin-content">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}