import api from './api';

export const syncCart = async (items) => {
    try {
        const response = await api.post('/cart/sync', { items });
        return response.data;
    } catch (err) {
        console.error('Sync cart error:', err);
        throw err;
    }
};

export const getCart = async () => {
    try {
        const response = await api.get('/cart');
        return response.data;
    } catch (err) {
        console.error('Get cart error:', err);
        return { success: false, data: { items: [] } };
    }
};

export const updateCart = async (items) => {
    try {
        const response = await api.put('/cart', { items });
        return response.data;
    } catch (err) {
        console.error('Update cart error:', err);
        throw err;
    }
};

