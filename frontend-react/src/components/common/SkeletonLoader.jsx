import './SkeletonLoader.css';

function SkeletonLoader({ count = 4 }) {
  return (
    <>
      {[...Array(count)].map((_, index) => 
        <div key={index} className="skeleton-card">
          <div className="skeleton-image"></div>
          <div className="skeleton-content">
            <div className="skeleton-title"></div>
            <div className="skeleton-text"></div>
            <div className="skeleton-text short"></div>
            <div className="skeleton-button"></div>
          </div>
        </div>
      )}
    </>
  );
}

export default SkeletonLoader;
