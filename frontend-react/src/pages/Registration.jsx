import TextField from '@mui/material/TextField'
import './Registration.css'
import { useState } from 'react';
import Checkbox from '@mui/material/Checkbox';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { registerUser } from '../api/authservice';
import FurnitureSlider from '../components/auth/FurnitureSlider';


function Registration() {

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    phoneno: '',
    password: '',
    confirmpassword: '',
  });

  const [isChecked, setIsChecked] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const { loading, setLoading } = useAuth();

  const validate = () => {
    const newErrors = {};

    if (!formData.fullname.trim()) {
      newErrors.fullname = "Full name is required";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!formData.phoneno.trim()) {
      newErrors.phoneno = "Phone number is required";
    } else if (!phoneRegex.test(formData.phoneno)) {
      newErrors.phoneno = "Enter a valid 10-digit phone number";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]/.test(formData.password)) {
      newErrors.password = "Password must contain uppercase, lowercase, number, and special character";
    }

    if (!formData.confirmpassword) {
      newErrors.confirmpassword = "Confirm password is required";
    } else if (formData.password !== formData.confirmpassword) {
      newErrors.confirmpassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setErrors({});

    if (setLoading) setLoading(true);

    try {
      const response = await registerUser(formData);
      console.log('Registration successful:', response);
      navigate('/verification-pending', { state: { email: formData.email } });
    } catch (err) {
      console.error('Registration failed:', err);
      setErrors({ submit: err.message || 'Registration failed. Please try again.' });
    } finally {
      if (setLoading) setLoading(false);
    }

  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  }

  // GOOGLE OAUTH HANDLER:
  const handleGoogleSignup = () => {
    window.location.href = 'http://localhost:5000/api/auth/google';
  };

  return (
    <div className="auth-split-container">
      <div className="auth-form-section">
        <div className='container registration-container py-5'>
          <div className="registration-content shadow m-auto">
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Create your account
            </h2>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="form-group mt-4 col-10">
                <div style={{ position: 'relative' }}>
                  <TextField
                    type='text'
                    id='fullname'
                    name='fullname'
                    value={formData.fullname}
                    fullWidth
                    label="Fullname"
                    onChange={handleChange}
                    error={!!errors.fullname}
                  />
                  {errors.fullname && (
                    <AlertCircle style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#d32f2f' }} size={20} />
                  )}
                </div>
                {errors.fullname && <p style={{ color: '#d32f2f', fontSize: '0.75rem', marginTop: '4px' }}>{errors.fullname}</p>}
              </div>

              <div className="form-group mt-4 col-10">
                <div style={{ position: 'relative' }}>
                  <TextField
                    type='email'
                    id='email'
                    name='email'
                    value={formData.email}
                    fullWidth
                    label="Email"
                    onChange={handleChange}
                    error={!!errors.email}
                  />
                  {errors.email && (
                    <AlertCircle style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#d32f2f' }} size={20} />
                  )}
                </div>
                {errors.email && <p style={{ color: '#d32f2f', fontSize: '0.75rem', marginTop: '4px' }}>{errors.email}</p>}
              </div>

              <div className="form-group mt-4 col-10">
                <div style={{ position: 'relative' }}>
                  <TextField
                    type='tel'
                    id='phoneno'
                    name='phoneno'
                    value={formData.phoneno}
                    fullWidth
                    label="Phone Number"
                    onChange={handleChange}
                    error={!!errors.phoneno}
                  />
                  {errors.phoneno && (
                    <AlertCircle style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#d32f2f' }} size={20} />
                  )}
                </div>
                {errors.phoneno && <p style={{ color: '#d32f2f', fontSize: '0.75rem', marginTop: '4px' }}>{errors.phoneno}</p>}
              </div>

              <div className="row">
                <div className="col-6">
                  <div className="form-group mt-4 col-10">
                    <div style={{ position: 'relative' }}>
                      <TextField
                        type={showPassword ? 'text' : 'password'}
                        id='password'
                        name='password'
                        value={formData.password}
                        fullWidth
                        label="Password"
                        onChange={handleChange}
                        error={!!errors.password}
                      />
                      <div style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', display: 'flex', gap: '5px' }}>
                        {errors.password && <AlertCircle style={{ color: '#d32f2f' }} size={20} />}
                        {showPassword ? (
                          <EyeOff onClick={() => setShowPassword(!showPassword)} style={{ cursor: "pointer" }} size={20} />
                        ) : (
                          <Eye onClick={() => setShowPassword(!showPassword)} style={{ cursor: "pointer" }} size={20} />
                        )}
                      </div>
                    </div>
                    {errors.password && <p style={{ color: '#d32f2f', fontSize: '0.75rem', marginTop: '4px' }}>{errors.password}</p>}
                  </div>


                </div>
                <div className="col-6">
                  <div className="form-group mt-4 col-10">
                    <div style={{ position: 'relative' }}>
                      <TextField
                        type={showConfirmPassword ? 'text' : 'password'}
                        id='confirmpassword'
                        name='confirmpassword'
                        value={formData.confirmpassword}
                        fullWidth
                        label="Confirm Password"
                        onChange={handleChange}
                        error={!!errors.confirmpassword}
                      />
                      <div style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', display: 'flex', gap: '5px' }}>
                        {errors.confirmpassword && <AlertCircle style={{ color: '#d32f2f' }} size={20} />}
                        {showConfirmPassword ? (
                          <EyeOff onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ cursor: "pointer" }} size={20} />
                        ) : (
                          <Eye onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ cursor: "pointer" }} size={20} />
                        )}
                      </div>
                    </div>
                    {errors.confirmpassword && <p style={{ color: '#d32f2f', fontSize: '0.75rem', marginTop: '4px' }}>{errors.confirmpassword}</p>}
                  </div>
                </div>
              </div>

              {/* <div className="remember-me mx-5 pt-4 w-100">
                <Checkbox id='rememberme' checked={isChecked} onChange={() => setIsChecked(!isChecked)} />
                <label htmlFor='rememberme' className="text-sm" style={{ cursor: "pointer", display: "inline-block" }}>
                  Remember Me
                </label>
              </div> */}

              <div className="btn-container w-100 d-flex justify-content-center align-items-center mt-4 ">
                <button type="submit" disabled={loading} className="w-50 registration-btn">
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              </div>

              <p className="mt-2 text-center text-sm text-gray-600">
                Or{' '}
                <NavLink
                  to="/login"
                  onClick={() => setIsLoginOpen(true)}
                  className="font-medium text-primary-600 hover:text-primary-500"
                >
                  sign in to your existing account
                </NavLink>
              </p>
            </form>

            {/* ============================================ */}
            {/* GOOGLE SIGN UP BUTTON */}
            {/* ============================================ */}
            <div className="google-auth-section">
              <div className="divider mb-2">
                <span>OR</span>
              </div>
              <button
                type="button"
                onClick={handleGoogleSignup}
                className="google-signup-btn"
              >
                <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                  <path fill="none" d="M0 0h48v48H0z" />
                </svg>
                <span>Sign up with Google</span>
              </button>

            </div>
          </div>
        </div>
      </div>
      <div className="auth-slider-section">
        <FurnitureSlider />
      </div>
    </div>
  )
}

export default Registration
