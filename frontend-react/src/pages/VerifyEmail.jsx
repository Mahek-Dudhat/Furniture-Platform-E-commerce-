import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './VerifyEmail.css';
import { verifyEmail } from '../api/authservice';

function VerifyEmail() {

  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');
  const { token } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      try {
        const response = await verifyEmail(token);
        setStatus('success');
        setMessage(response.message);

        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } catch (error) {
        setStatus('error');
        setMessage(error.message || 'Verification failed. The link may have expired.');
      }
    };

    if (token) {
      verify();
    }
  }, [token, navigate])

  return (
    <>
      <div className="verify-email-container">
        <div className="verify-email-card">
          {status === 'verifying' && (
            <>
              <div className="spinner"></div>
              <h2>Verifying Your Email...</h2>
              <p>Please wait while we verify your email address.</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="success-icon">✓</div>
              <h2>Email Verified Successfully!</h2>
              <p>{message}</p>
              <p className="redirect-message">Redirecting to login...</p>
              <Link to="/login" className="btn-login">
                Go to Login
              </Link>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="error-icon">✗</div>
              <h2>Verification Failed</h2>
              <p>{message}</p>
              <div className="error-actions">
                <Link to="/resend-verification" className="btn-resend">
                  Resend Verification Email
                </Link>
                <Link to="/register" className="btn-register-again">
                  Register Again
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );

}

export default VerifyEmail;
