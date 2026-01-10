import { Component } from 'react';
import './ErrorPage.css';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="error-page">
                    <div className="error-content">
                        <div className="error-icon">⚠️</div>
                        <h1>Oops! Something Went Wrong</h1>
                        <p>We're sorry for the inconvenience. Our team has been notified.</p>
                        <div className="error-actions">
                            <button onClick={() => window.location.href = '/'} className="btn-primary">
                                Go Home
                            </button>
                            <button onClick={() => window.location.reload()} className="btn-secondary">
                                Retry
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
