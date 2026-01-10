import api from "./api";

export const registerUser = async (userData) => {
    try {

        const response = await api.post('/auth/register', userData);
        return response.data;
    } catch (err) {
        return err.response?.data || { message: 'Registration failed' };
    }
}

export const loginUser = async (credentials) => {
    try {
        const response = await api.post('/auth/login', credentials);
        console.log('Login response data:', response.data);
        return response.data;
    } catch (err) {
        console.log('Login error response:', err.response);
        return err.response?.data || { message: 'Login failed' };
    }
}

// helper to set auth header after login
export const setAuthToken = (token) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
}

export const verifyEmail = async (token) => {

    try {
        const response = await api.get(`/auth/verify-email/${token}`);
        return response.data;
    } catch (err) {
        return err.response?.data || { message: 'Verification failed' };
    }
}

export const resendVerificationEmail = async (email) => {
    try {
        const response = await api.post('/auth/resend-verification', { email });
        return response.data;
    } catch (err) {
        return err.response?.data || { message: 'Resend verification failed' };
    }
}

export const getUserProfile = async () => {
    try {

        const response = await api.get('/user/profile');
        return response?.data;
    } catch (err) {
        return err.response?.data || { message: 'Failed to fetch user data' };
    }
}

export const updateUserProfile = async (profileData) => {
    try {
        const response = await api.put('/user/profile', profileData);
        return response?.data;
    } catch (err) {
        return err.response?.data || { message: 'Failed to update profile' };
    }
}

export const uploadProfilePicture = async (formData) => {
    try {
        const response = await api.post('/user/profile/picture', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response?.data;
    } catch (err) {
        return err.response?.data || { message: 'Failed to upload profile picture' };
    }
}
