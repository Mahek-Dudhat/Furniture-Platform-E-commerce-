import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function GoogleAuthSuccess() {

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { login } = useAuth();

    useEffect(() => {

        const handleGoogleAuth = async () => {

            const token = searchParams.get('token');
            const user = JSON.parse(searchParams.get('user'));

            if (token && user) {
                try {

                    localStorage.setItem('token', token);

                    const response = await login(token, user);
                    console.log('Login response:', response);

                    // Redirect admin users to dashboard, regular users to home
                    if (user.role === 'admin') {
                        navigate('/admin/dashboard');
                    } else {
                        navigate('/', {
                            state: {
                                showWelcome: true,
                                message: 'Successfully logged in with Google!'
                            }
                        });
                    }
                }
                catch (err) {

                    console.error('Error:', err);
                    navigate('/login?error=auth_failed');
                }
            } else {
                // No token in URL? Something went wrong
                navigate('/login?error=no_token');
            }
        }

        handleGoogleAuth();
    }, [searchParams, login, navigate]);

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            flexDirection: 'column'
        }}>
            <div className="spinner"></div>
            <h2>Completing Google Sign-in...</h2>
            <p>Please wait while we set up your account.</p>
        </div>
    );
}

export default GoogleAuthSuccess
