// src/pages/VerificationPending.jsx
import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import './VerificationPending.css';
import { resendVerificationEmail } from '../api/authservice';
// import { resendVerification } from '../services/authService';

const VerificationPending = () => {
    const location = useLocation();
    const email = location.state?.email || '';
    const [resending, setResending] = useState(false);
    const [message, setMessage] = useState('');

    const handleResend = async () => {
        setResending(true);
        setMessage('');

        try {
            await resendVerificationEmail(email);
            setMessage('✓ Verification email sent again! Please check your inbox.');
        } catch (error) {
            setMessage('✗ Failed to resend email. Please try again.');
        } finally {
            setResending(false);
        }
    };

    return (
        <div className="verification-pending-container">
            <div className="verification-pending-card">
                <div className="email-icon">📧</div>

                <h2>Check Your Email</h2>

                <p className="main-message">
                    We've sent a verification email to:
                </p>

                <p className="email-address">{email}</p>

                <div className="instructions">
                    <p><strong>Next steps:</strong></p>
                    <ol>
                        <li>Open your email inbox</li>
                        <li>Look for an email from Aura Vista Furniture</li>
                        <li>Click the "Verify Email" button in the email</li>
                        <li>You'll be redirected back to complete the process</li>
                    </ol>
                </div>

                <div className="info-box">
                    <p>📌 <strong>Tip:</strong> If you don't see the email, check your spam or junk folder.</p>
                </div>

                {message && (
                    <div className={`message ${message.includes('✓') ? 'success' : 'error'}`}>
                        {message}
                    </div>
                )}

                <button
                    onClick={handleResend}
                    className="btn-resend"
                    disabled={resending}
                >
                    {resending ? 'Sending...' : 'Resend Verification Email'}
                </button>

                <div className="footer-links">
                    <Link to="/login">Back to Login</Link>
                </div>
            </div>
        </div>
    );
};

export default VerificationPending;