import { useState, useEffect } from 'react'
import './HeroSlider.css'
import { NavLink } from 'react-router-dom'

const slides = [
    {
        image: './slideshow/slide1.webp',
        subtitle: 'MINIMAL MEETS FUNCTIONAL',
        title: 'Redefine Comfort\n& Luxury',
        description: 'Experience the latest trends in sustainable furniture.\nStylish designs that bring warmth to your living space.'
    },
    {
        image: './slideshow/slide2.avif',
        subtitle: 'TIMELESS ELEGANCE',
        title: 'Modern Furniture For\nEvery Space',
        description: 'Discover handcrafted pieces that blend comfort and style.\nPerfectly designed to elevate your home\'s personality.'
    },
    {
        image: './slideshow/slide3.jpg',
        subtitle: 'CRAFTED WITH CARE',
        title: 'Transform Your\nLiving Space',
        description: 'Premium quality furniture that stands the test of time.\nCreate the perfect ambiance for your home.'
    },
    {
        image: './slideshow/slide4.avif',
        subtitle: 'CONTEMPORARY DESIGN',
        title: 'Elevate Your\nHome Style',
        description: 'Innovative designs that combine beauty and functionality.\nMake every corner of your home extraordinary.'
    }
]

const HeroSlider = () => {
    const [currentSlide, setCurrentSlide] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length)
        }, 5000)
        return () => clearInterval(timer)
    }, [])

    const goToSlide = (index) => {
        setCurrentSlide(index)
    }

    return (
        <main className='hero-section'>
            <div className="hero-slider container-fluid">
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className={`slide ${index === currentSlide ? 'active' : ''}`}
                        style={{ backgroundImage: `url(${slide.image})` }}
                    >
                        <div className="slide-content">
                            <p className="slide-subtitle">{slide.subtitle}</p>
                            <h1 className="slide-title">{slide.title}</h1>
                            <p className="slide-description">{slide.description}</p>
                            <NavLink to="/collections/all">
                                <button className="shop-now-btn">SHOP NOW →</button>
                            </NavLink>
                        </div>
                    </div>
                ))}

                <div className="slider-dots">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            className={`dot ${index === currentSlide ? 'active' : ''}`}
                            onClick={() => goToSlide(index)}
                        />
                    ))}
                </div>
            </div>
        </main>
    )
}

export default HeroSlider
