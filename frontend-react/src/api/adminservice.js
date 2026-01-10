import api from './api';

// Dashboard
export const getDashboardStats = async (startDate, endDate) => {
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    return api.get('/admin/dashboard/stats', { params });
};

export const getSalesAnalytics = async (period = 'month') => {
    return api.get('/admin/dashboard/sales', { params: { period } });
};

// Products
export const getAllProducts = async (params = {}) => {
    return api.get('/admin/products', { params });
};

export const createProduct = async (formData) => {
    return api.post('/admin/products', formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
};

export const updateProduct = async (id, formData) => {
    return api.put(`/admin/products/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
};

export const deleteProduct = async (id) => {
    return api.delete(`/admin/products/${id}`);
};

export const bulkUpdateStock = async (updates) => {
    return api.patch('/admin/products/bulk-stock', { updates });
};

// Orders
export const getAllOrders = async (params = {}) => {
    return api.get('/admin/orders', { params });
};

export const updateOrderStatus = async (id, data) => {
    return api.put(`/admin/orders/${id}/status`, data);
};

// Users
export const getAllUsers = async (params = {}) => {
    return api.get('/admin/users', { params });
};

export const getUserById = async (id) => {
    return api.get(`/admin/users/${id}`);
};

export const updateUserRole = async (id, role) => {
    return api.put(`/admin/users/${id}/role`, { role });
};

export const toggleUserStatus = async (id) => {
    return api.patch(`/admin/users/${id}/toggle-status`);
};

export const getUserStats = async () => {
    return api.get('/admin/users/stats/overview');
};

export const deleteUser = async (id) => {
    return api.delete(`/admin/users/${id}`);
};

// Coupons
export const createCoupon = async (data) => {
    return api.post('/admin/coupons', data);
};

export const updateCoupon = async (id, data) => {
    return api.put(`/admin/coupons/${id}`, data);
};

export const deleteCoupon = async (id) => {
    return api.delete(`/admin/coupons/${id}`);
};

export const getAllCoupons = async (params = {}) => {
    return api.get('/admin/coupons', { params });
};

export const toggleCouponStatus = async (id) => {
    return api.patch(`/admin/coupons/${id}/toggle-status`);
};
