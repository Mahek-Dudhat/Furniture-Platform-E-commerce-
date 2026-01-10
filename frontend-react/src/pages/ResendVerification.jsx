import { useState } from 'react';
import { Link } from 'react-router-dom';
import { resendVerificationEmail } from '../api/authservice';
import './ResendVerification.css';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';

function ResendVerification() {

    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email) {
            setError('Please enter your email address');
            return;
        }

        setLoading(true);

        try {
            const response = await resendVerificationEmail(email);
            setSuccess(true);
        } catch (err) {
            setError(err.message || 'Failed to resend verification email');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="resend-container">
            <div className="resend-card">
                <div className="resend-header">
                    <h2>Resend Verification Email</h2>
                    <p>Enter your email to receive a new verification link</p>
                </div>

                {error && (
                    <Alert severity='error'>{error}</Alert>
                )}

                {success && (
                    <Alert severity='success'>
                        Verification email sent successfully! Please check your inbox.
                    </Alert>
                )}

                <form onSubmit={handleSubmit} className="resend-form">
                    <div className="form-group">
                        <TextField
                            type='email'
                            id='email'
                            name='email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder='jhon@example.com'
                            fullWidth
                            label="Email"
                            color='black'
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn-submit"
                        disabled={loading}
                    >
                        {loading ? 'Sending...' : 'Resend Verification Email'}
                    </button>
                </form>

                <div className="resend-footer">
                    <Link to="/login">Back to Login</Link>
                </div>
            </div>
        </div>
    )
}

export default ResendVerification
