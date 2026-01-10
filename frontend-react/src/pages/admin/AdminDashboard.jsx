import { useState, useEffect } from 'react';
import { getDashboardStats, getSalesAnalytics } from '../../api/adminservice';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, ShoppingCart, Users, DollarSign, Package, CreditCard, ArrowUpRight, ArrowDownRight, Clock, CheckCircle, XCircle, Truck } from 'lucide-react';
import './AdminDashboard.css';
import Alert from '@mui/material/Alert';

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [salesData, setSalesData] = useState([]);
    const [period, setPeriod] = useState('month');
    const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchDashboardData();
    }, [period, dateRange.startDate, dateRange.endDate]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError('');

            const [statsRes, salesRes] = await Promise.all([
                getDashboardStats(dateRange.startDate, dateRange.endDate),
                getSalesAnalytics(period)
            ]);

            console.log('Stats Response:', statsRes);
            console.log('Sales Response:', salesRes);

            setStats(statsRes.data.data);
            setSalesData(salesRes.data.data);
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            setError(err.message || 'Failed to load dashboard data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="admin-loading">Loading Dashboard...</div>;

    const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
    const categoryColors = ['#6366f1', '#10b981', '#06b6d4', '#f59e0b', '#ec4899', '#ef4444'];

    if (error) {
        return (
            <Alert severity='error' className='admin-error'>
                <h2>⚠️ Something went wrong</h2>
                <p>{error}</p>
                <button onClick={fetchDashboardData}>Retry</button>
            </Alert>
        );
    }

    return (
        <div className="admin-dashboard">
            <div className="dashboard-header">
                <h1>Admin Dashboard</h1>
                <div className="filters">
                    <input
                        type="date"
                        value={dateRange.startDate}
                        onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                    />
                    <input
                        type="date"
                        value={dateRange.endDate}
                        onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                    />
                    <div className="period-selector">
                        <button onClick={() => setPeriod('day')} className={period === 'day' ? 'active' : ''}>Day</button>
                        <button onClick={() => setPeriod('week')} className={period === 'week' ? 'active' : ''}>Week</button>
                        <button onClick={() => setPeriod('month')} className={period === 'month' ? 'active' : ''}>Month</button>
                        <button onClick={() => setPeriod('year')} className={period === 'year' ? 'active' : ''}>Year</button>
                    </div>
                </div>
            </div>

            {/* Stats cards */}
            <div className="stats-grid">
                <div className="stats-card revenue">
                    <div className="stat-header">
                        <div className="stat-icon"><DollarSign size={20} /></div>
                        <span className="stat-trend positive"><ArrowUpRight size={16} /> 12.5%</span>
                    </div>
                    <div className="stat-content">
                        <h3>Total Revenue</h3>
                        <p className='stat-value'>₹{Number(stats?.revenue?.totalRevenue || 0).toLocaleString()}</p>
                        <span className='stat-label'>{stats?.revenue?.totalOrders || 0} orders</span>
                    </div>
                </div>

                <div className="stats-card orders">
                    <div className="stat-header">
                        <div className="stat-icon"><ShoppingCart size={20} /></div>
                        <span className="stat-trend positive"><ArrowUpRight size={16} /> 8.2%</span>
                    </div>
                    <div className="stat-content">
                        <h3>Total Orders</h3>
                        <p className="stat-value">{stats?.revenue?.totalOrders || 0}</p>
                        <span className="stat-label">All time</span>
                    </div>
                </div>

                <div className="stats-card users">
                    <div className="stat-header">
                        <div className="stat-icon"><Users size={20} /></div>
                        <span className="stat-trend positive"><ArrowUpRight size={16} /> 5.1%</span>
                    </div>
                    <div className="stat-content">
                        <h3>Active Users</h3>
                        <p className="stat-value">{stats?.ordersByStatus?.reduce((acc, curr) => acc + curr.count, 0) || 0}</p>
                        <span className="stat-label">Registered</span>
                    </div>
                </div>

                <div className="stats-card products">
                    <div className="stat-header">
                        <div className="stat-icon"><Package size={20} /></div>
                        <span className="stat-trend negative"><ArrowDownRight size={16} /> 2.4%</span>
                    </div>
                    <div className="stat-content">
                        <h3>Products</h3>
                        <p className="stat-value">{stats?.topProducts?.length || 0}</p>
                        <span className="stat-label">In stock</span>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="dashboard-grid">
                {/* Sales Trend Chart */}
                <div className="chart-card sales-chart">
                    <div className="card-header">
                        <h3>Order Status</h3>
                        <div className="period-selector-inline">
                            <button onClick={() => setPeriod('day')} className={period === 'day' ? 'active' : ''}>Today</button>
                            <button onClick={() => setPeriod('week')} className={period === 'week' ? 'active' : ''}>Weekly</button>
                            <button onClick={() => setPeriod('year')} className={period === 'year' ? 'active' : ''}>Yearly</button>
                        </div>
                    </div>
                    <div className="chart-legend">
                        <div className="legend-item">
                            <span className="legend-dot paid"></span>
                            <span>Paid</span>
                        </div>
                        <div className="legend-item">
                            <span className="legend-dot unpaid"></span>
                            <span>Unpaid</span>
                        </div>
                        <div className="legend-item">
                            <span className="legend-dot refunded"></span>
                            <span>Refunded</span>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={280}>
                        <LineChart data={salesData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                            <XAxis
                                dataKey="_id"
                                stroke="#94a3b8"
                                style={{ fontSize: '0.75rem' }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                stroke="#94a3b8"
                                style={{ fontSize: '0.75rem' }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip
                                contentStyle={{
                                    borderRadius: '8px',
                                    border: '1px solid #e2e8f0',
                                    background: '#1e293b',
                                    color: '#fff'
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="totalSales"
                                stroke="#6366f1"
                                strokeWidth={3}
                                name="Paid"
                                dot={{ fill: '#6366f1', r: 5 }}
                                activeDot={{ r: 7 }}
                            />
                            <Line
                                type="monotone"
                                dataKey="orderCount"
                                stroke="#94a3b8"
                                strokeWidth={2}
                                name="Unpaid"
                                dot={false}
                                strokeDasharray="5 5"
                            />
                            <Line
                                type="monotone"
                                dataKey="orderCount"
                                stroke="#10b981"
                                strokeWidth={2}
                                name="Refunded"
                                dot={false}
                                strokeDasharray="5 5"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Payment Methods */}
                <div className="chart-card payment-methods">
                    <div className="card-header">
                        <h3>Payment Methods</h3>
                    </div>
                    <div className="payment-list">
                        {stats?.paymentMethods?.map((method, index) => {
                            const total = stats.paymentMethods.reduce((sum, m) => sum + m.count, 0);
                            const percentage = ((method.count / total) * 100).toFixed(0);
                            return (
                                <div key={index} className="payment-item">
                                    <div className="payment-info">
                                        <CreditCard size={18} style={{ color: COLORS[index % COLORS.length] }} />
                                        <span className="payment-name">{method._id}</span>
                                    </div>
                                    <div className="payment-stats">
                                        <span className="payment-percentage">{percentage}%</span>
                                        <div className="payment-bar">
                                            <div className="payment-fill" style={{ width: `${percentage}%`, background: COLORS[index % COLORS.length] }}></div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Top Selling Categories */}
                <div className="chart-card categories-card">
                    <div className="card-header">
                        <h3>Top Selling Categories</h3>
                    </div>
                    <div className="categories-list">
                        {stats?.topCategories?.slice(0, 6).map((cat, index) => (
                            <div key={index} className="category-item">
                                <span className="category-name">{cat._id || 'Uncategorized'}</span>
                                <div className="category-bar">
                                    <div className="category-fill" style={{ width: `${(cat.count / stats.topCategories[0].count) * 100}%`, background: categoryColors[index % categoryColors.length] }}></div>
                                </div>
                                <span className="category-count">{cat.count}</span>
                            </div>
                        )) || <p className="no-data">No category data available</p>}
                    </div>
                </div>

                {/* Top Products */}
                <div className="chart-card top-products">
                    <div className="card-header">
                        <h3>Top Selling Products</h3>
                        <button className="view-all-btn">View All</button>
                    </div>
                    <div className="products-list">
                        {stats?.topProducts?.slice(0, 5).map((product, index) => (
                            <div key={index} className="product-item">
                                <div className="admin-product-image">
                                    <img src={product.images?.[0]?.url || '/placeholder.png'} alt={product.name} />
                                </div>
                                <div className="product-details">
                                    <h4>{product.name}</h4>
                                    <span className="product-category">{product.category}</span>
                                </div>
                                <div className="product-stats">
                                    <span className="product-price">₹{product.price?.toLocaleString()}</span>
                                    <span className="product-sales">{product.salesCount || 0} Sales</span>
                                </div>
                            </div>
                        )) || <p className="no-data">No product data available</p>}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="chart-card recent-activity">
                    <div className="card-header">
                        <h3>Recent Activity</h3>
                        <button className="view-all-btn">View All</button>
                    </div>
                    <div className="activity-list">
                        {stats?.recentOrders?.slice(0, 6).map((order, index) => {
                            const getActivityIcon = (status) => {
                                switch (status) {
                                    case 'pending': return <Clock size={16} />;
                                    case 'processing': return <Package size={16} />;
                                    case 'shipped': return <Truck size={16} />;
                                    case 'delivered': return <CheckCircle size={16} />;
                                    case 'cancelled': return <XCircle size={16} />;
                                    default: return <ShoppingCart size={16} />;
                                }
                            };
                            const getTimeAgo = (date) => {
                                const seconds = Math.floor((new Date() - new Date(date)) / 1000);
                                if (seconds < 3600) return `${Math.floor(seconds / 60)} mins ago`;
                                if (seconds < 86400) return `${Math.floor(seconds / 3600)} hrs ago`;
                                return `${Math.floor(seconds / 86400)} days ago`;
                            };
                            return (
                                <div key={index} className="activity-item">
                                    <div className={`activity-icon ${order.orderStatus}`}>
                                        {getActivityIcon(order.orderStatus)}
                                    </div>
                                    <div className="activity-details">
                                        <h4>Order {order.orderStatus === 'pending' ? 'Placed' : order.orderStatus === 'shipped' ? 'Shipped' : 'Updated'} - #{order.orderNumber}</h4>
                                        <p>{order.user?.fullname} • ₹{order.pricing?.total?.toLocaleString()}</p>
                                    </div>
                                    <span className="activity-time">{getTimeAgo(order.createdAt)}</span>
                                </div>
                            );
                        }) || <p className="no-data">No recent activity</p>}
                    </div>
                </div>

                {/* Order Status Distribution */}
                <div className="chart-card order-status">
                    <div className="card-header">
                        <h3>Order Status</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={240}>
                        <BarChart data={stats?.ordersByStatus || []} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis type="number" stroke="#94a3b8" style={{ fontSize: '0.75rem' }} />
                            <YAxis dataKey="_id" type="category" stroke="#94a3b8" style={{ fontSize: '0.75rem' }} width={80} />
                            <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                            <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
