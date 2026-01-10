import './SkeletonBox.css';

const SkeletonBox = ({ height = 100 }) => {
    return <div className="skeleton" style={{ height }} />;
};

export default SkeletonBox;
