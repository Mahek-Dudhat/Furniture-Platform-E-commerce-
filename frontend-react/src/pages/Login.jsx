import { useState, useEffect } from 'react';
import TextField from "@mui/material/TextField";
import { useProducts } from "../context/FurnitureProductsProvider"
import './Login.css';
import { NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { loginUser, setAuthToken } from '../api/authservice';
import Alert from '@mui/material/Alert';
import FurnitureSlider from '../components/auth/FurnitureSlider';

function Login() {

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [success, setSuccess] = useState('');
    const [errors, setErrors] = useState({});
    const [error, setError] = useState('');
    const [needsVerification, setNeedsVerification] = useState(false);
    const [loadingLocal, setLoadingLocal] = useState(false);
    const { setLoading, login } = useAuth();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const errorParam = searchParams.get('error');
        console.log("error in google auth", errorParam);
        if (errorParam) {
            setError(decodeURIComponent(errorParam));
        }
    }, [searchParams]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setNeedsVerification(false);

        setErrors({ ...errors, [e.target.name]: '' });

        if (error) {
            setError('');
        }

    };

    const validate = () => {
        const newErrors = {};

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setNeedsVerification(false);
        setSuccess('');
        setError('');
        setErrors({});

        if (!validate()) return;

        setLoadingLocal(true);
        if (setLoading) setLoading(true);

        try {
            const res = await loginUser(formData);
            console.log('Login response:', res);
            const token = res.token;

            if (res.status == 200) {
                setSuccess(res.message || 'Login successful!');


            } else {
                setError(res.message || 'Login failed. Please try again.');
            }

            if (token) {
                const userData = { email: res.user.email, fullname: res.user.fullname, role: res.user.role };
                login(token, userData);
                setAuthToken(token);
                
                // Redirect admin users to dashboard, regular users to home
                if (res.user.role === 'admin') {
                    navigate('/admin/dashboard');
                } else {
                    navigate('/', { state: { showWelcome: true } });
                }
            }


        } catch (err) {
            console.log('Login error:', err);
            if (err.needsVerification) {
                setNeedsVerification(true);
                setErrors({ msg: err.message });
            }
        } finally {
            if (setLoading) setLoading(false);
            setLoadingLocal(false);
        }
    };

    // GOOGLE OAUTH HANDLER:
    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:5000/api/auth/google';
    };

    console.log('Current error state:', error);

    return (
        <div className="auth-split-container">
            <div className="auth-form-section">
                <div className="login-container container">
                    <div className="login-content shadow m-auto">
                        <div className="login-header">
                            <h1>Login</h1>
                        </div>

                        <p className="b-3">Please login with your credentials</p>

                        {
                            error && (
                                <Alert severity="error">{error}</Alert>
                            )
                        }
                        {
                            success && (
                                <Alert severity="success">{success}</Alert>
                            )
                        }
                        {needsVerification && (
                            <div className="verification-notice">
                                <p>Didn't receive the email?</p>
                                <Link to="/resend-verification" className="link-resend">
                                    Resend verification email
                                </Link>
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="form-group col-10">
                                <div style={{ position: 'relative' }}>
                                    <TextField
                                        type='email'
                                        id='email'
                                        name='email'
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder='jhon@example.com'
                                        fullWidth
                                        label="Email"
                                        color='black'
                                        error={!!errors.email}

                                    />
                                    {errors.email && (
                                        <AlertCircle style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#d32f2f' }} size={20} />
                                    )}
                                </div>
                                {errors.email && <p style={{ textAlign: "left", color: '#d32f2f', fontSize: '0.75rem', marginTop: '4px' }}>{errors.email}</p>}
                            </div>

                            <div className="form-group mt-4 col-10">
                                <div style={{ position: 'relative' }}>
                                    <TextField
                                        type={showPassword ? 'text' : 'password'}
                                        id='password'
                                        name='password'
                                        value={formData.password}
                                        onChange={handleChange}
                                        fullWidth
                                        label="Password"
                                        color='black'
                                        error={!!errors.password}
                                    />
                                    <div style={{ position: 'absolute', right: '36px', top: '50%', transform: 'translateY(-50%)', display: 'flex', gap: '5px' }}>
                                        {errors.password && <AlertCircle style={{ color: '#d32f2f' }} size={20} />}
                                        {showPassword ? (
                                            <EyeOff onClick={() => setShowPassword(!showPassword)} style={{ cursor: "pointer", position: "absolute", left: "92%", alignSelf: "center" }} className="absolute inset-y-0 right-100 pr-3 flex items-center h-4 w-4 text-gray-400" />
                                        ) : (
                                            <Eye onClick={() => setShowPassword(!showPassword)} style={{ cursor: "pointer", position: "absolute", left: "92%", alignSelf: "center" }} className="absolute inset-y-0 right- pr-3 flex items-center h-4 w-4 text-gray-400" />
                                        )}
                                    </div>
                                </div>
                                {errors.password && <p style={{ textAlign: "left", color: '#d32f2f', fontSize: '0.75rem', marginTop: '4px' }}>{errors.password}</p>}
                            </div>

                            <div className="btn-container mt-4 w-100">
                                <button type="submit" disabled={loadingLocal} className="login-btn">
                                    {loadingLocal ? "Logging in..." : "Login"}
                                </button>
                            </div>

                            {/* GOOGLE SIGN IN BUTTON */}
                            {/* ============================================ */}
                            <div className="google-auth-section mt-4">
                                <div className="divider mt-4 mb-4">
                                    <span>OR</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleGoogleLogin}
                                    className="google-login-btn"
                                >
                                    <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                                        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                                        <path fill="none" d="M0 0h48v48H0z" />
                                    </svg>
                                    <span>Continue with Google</span>
                                </button>


                            </div>

                            <div className="form-container ">
                                <p>New Customer?   <NavLink to="/register" style={{ color: 'black', textDecoration: 'underline' }}>Signup</NavLink></p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className="auth-slider-section">
                <FurnitureSlider />
            </div>
        </div>
    )
}

export default Login

