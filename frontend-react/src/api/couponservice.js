import api from './api';

export const applyCoupon = async (code) => {
    try {
        const response = await api.post('/coupons/apply', { code });
        return response.data;
    } catch (err) {
        console.log("cupon error:", err);
        throw err.response?.data || { message: 'Failed to apply coupon' };
    }
};

export const getActiveCoupons = async () => {
    try {
        const response = await api.get('/coupons/active');
        return response.data;
    } catch (err) {
        return err.response?.data || { message: 'Failed to fetch coupons' };
    }
};
