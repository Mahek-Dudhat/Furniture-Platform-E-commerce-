import { Package, CheckCircle, Truck, Home, XCircle } from 'lucide-react';
import './OrderTracker.css';

function OrderTracker({ currentStatus, statusHistory }) {
  const statuses = [
    { key: 'pending', label: 'Order Placed', icon: Package },
    { key: 'confirmed', label: 'Confirmed', icon: CheckCircle },
    { key: 'processing', label: 'Processing', icon: Package },
    { key: 'shipped', label: 'Shipped', icon: Truck },
    { key: 'delivered', label: 'Delivered', icon: Home }
  ];

  const getCurrentIndex = () => {
    if (currentStatus === 'cancelled') return -1;
    return statuses.findIndex(s => s.key === currentStatus);
  };

  const currentIndex = getCurrentIndex();
  const isCancelled = currentStatus === 'cancelled';

  const getStatusDate = (statusKey) => {
    const status = statusHistory?.find(s => s.status === statusKey);
    return status ? new Date(status.timestamp).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short'
    }) : null;
  };

  if (isCancelled) {
    return (
      <div className="order-tracker cancelled">
        <div className="cancelled-status">
          <XCircle size={48} />
          <h3>Order Cancelled</h3>
          <p>{getStatusDate('cancelled')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="order-tracker">
      <div className="tracker-steps">
        {statuses.map((status, index) => {
          const Icon = status.icon;
          const isCompleted = index <= currentIndex;
          const isCurrent = index === currentIndex;
          const statusDate = getStatusDate(status.key);

          return (
            <div key={status.key} className="tracker-step">
              <div className={`step-connector ${isCompleted ? 'completed' : ''}`} />
              <div className={`step-icon ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}>
                <Icon size={24} />
              </div>
              <div className="step-label">
                <p className="step-title">{status.label}</p>
                {statusDate && <p className="step-date">{statusDate}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default OrderTracker;
