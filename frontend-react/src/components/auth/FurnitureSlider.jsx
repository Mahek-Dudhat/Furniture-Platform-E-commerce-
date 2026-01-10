import { useState, useEffect } from 'react';
import './FurnitureSlider.css';

const furnitureImages = [
    {
        url: 'https://images.unsplash.com/photo-1638284457192-27d3d0ec51aa?w=1200&q=80',
        alt: 'Modern luxury living room with contemporary furniture'
    },
    {
        url: 'https://images.unsplash.com/photo-1621293963724-1b1a93602c50?w=1200&q=80',
        alt: 'Contemporary designer sofa with unique striped design'
    },
    {
        url: 'https://images.unsplash.com/photo-1704383014609-747c5afc2bc1?w=1200&q=80',
        alt: 'Elegant dining room with modern furniture'
    },
    {
        url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80',
        alt: 'Modern workspace with stylish furniture'
    }
];

const FurnitureSlider = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % furnitureImages.length);
        }, 3500); // Change every 3.5 seconds

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="furniture-slider">
            {furnitureImages.map((image, index) => (
                <div
                    key={index}
                    className={`furniture-slide ${index === currentSlide ? 'active' : ''}`}
                    style={{ backgroundImage: `url(${image.url})` }}
                    role="img"
                    aria-label={image.alt}
                >
                    <div className="furniture-overlay"></div>
                </div>
            ))}
        </div>
    );
};

export default FurnitureSlider;
