import { useNavigate } from 'react-router-dom';
import '../components/common/ErrorPage.css';

function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="error-page">
            <div className="error-content">
                <div className="error-icon">🔍</div>
                <h1>404 - Page Not Found</h1>
                <p>The page you're looking for doesn't exist or has been moved.</p>
                <div className="error-actions">
                    <button onClick={() => navigate('/')} className="btn-primary">
                        Go Home
                    </button>
                    <button onClick={() => navigate(-1)} className="btn-secondary">
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
}

export default NotFound;
