import api from './api';

export const getAllProducts = async (params = {}) => {
    try {
        const response = await api.get('/products', { params });
        return response.data;
    } catch (err) {
        return err.response?.data || { message: 'Failed to fetch products' };
    }
}

// Get single product by productId
export const getProductByProductId = async (id) => {
    try {
        const response = await api.get(`/products/${id}`);
        return response.data;
    } catch (err) {
        return err.response?.data || { message: 'Failed to fetch product' };
    }
}

// Get filter options
export const getFilterOptions = async (category) => {
    try {
        const response = await   api.get('/products/filters/options', { params: { category } });
        return response.data;
    } catch (err) {
        throw err.response?.data || { message: 'Failed to fetch filter options' };
    }
}