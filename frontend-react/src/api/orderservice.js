import api from './api';

export const createRazorpayOrder = async (amount) => {
    try {
        const response = await api.post('/orders/create-razorpay-order', { amount });
        return response.data;
    } catch (err) {
        throw err.response?.data || { message: 'Failed to create payment order' };
    }
}

export const verifyRazorpayPaynent = async (paymentData) => {
    try {
        const response = await api.post('/orders/verify-payment', paymentData);
        return response.data;
    } catch (err) {
        throw err.response?.data || { message: 'Payment verification failed' };
    }
}

export const createOrder = async (orderData) => {
    try {
        console.log("Order Data:", orderData);
        const response = await api.post('/orders/create', orderData);
        return response.data;
    } catch (err) {
        return err.response?.data || { message: 'Failed to create order' };
    }

}

export const getUserOrders = async () => {
    try {
        const response = await api.get('/orders/my-orders');
        return response.data;
    } catch (err) {
        return err.response?.data || { message: 'Failed to fetch orders' };
    }

}

export const getOrderById = async (id) => {
    try {
        const response = await api.get(`/orders/${id}`);
        return response.data;
    } catch (err) {
        return err.response?.data || { message: 'Failed to fetch order' };
    }
}
export const cancelOrder = async (orderId, reason) => {
    try {
        const response = await api.put(`/orders/${orderId}/cancel`, { reason });
        return response?.data;
    } catch (err) {

    }
}