import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./banner.css";

const slides = [
    {
        id: 1,
        tag: "NEW ARRIVALS",
        title: "Discover Your",
        highlight: "Perfect Style",
        description:
            "Explore the latest collection of fashion, accessories, and lifestyle products only on ShopNest.",
        buttonText: "SHOP NOW",
        link: "/shop",
        image:
            "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1400&q=85",
        offer: "UP TO 50% OFF",
    },

    {
        id: 2,
        tag: "SMART TECHNOLOGY",
        title: "Upgrade Your",
        highlight: "Everyday Tech",
        description:
            "Discover the latest gadgets and electronics designed to make your life smarter and easier.",
        buttonText: "EXPLORE NOW",
        link: "/shop?category=Electronics",
        image:
            "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?auto=format&fit=crop&w=1400&q=85",
        offer: "UP TO 40% OFF",
    },

    {
        id: 3,
        tag: "HOME COLLECTION",
        title: "Make Your Home",
        highlight: "Feel Amazing",
        description:
            "Beautiful products for every corner of your home. Shop comfort, style, and quality.",
        buttonText: "SHOP HOME",
        link: "/shop?category=Home",
        image:
            "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1400&q=85",
        offer: "UP TO 35% OFF",
    },

    {
        id: 4,
        tag: "LIMITED TIME SALE",
        title: "Amazing Deals",
        highlight: "Just For You",
        description:
            "Don't miss our biggest deals of the season. Grab your favorite products before they're gone.",
        buttonText: "VIEW DEALS",
        link: "/shop",
        image:
            "https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=1400&q=85",
        offer: "SALE UP TO 60%",
    },
];

const Banner = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const nextSlide = () => {
        setCurrentSlide((previous) =>
            previous === slides.length - 1 ? 0 : previous + 1
        );
    };

    const previousSlide = () => {
        setCurrentSlide((previous) =>
            previous === 0 ? slides.length - 1 : previous - 1
        );
    };

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    /*
     * Automatic slide change
     */
    useEffect(() => {
        if (isPaused) return;

        const interval = setInterval(() => {
            nextSlide();
        }, 4000);

        return () => clearInterval(interval);
    }, [isPaused]);

    /*
     * Keyboard navigation
     */
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "ArrowRight") {
                nextSlide();
            }

            if (event.key === "ArrowLeft") {
                previousSlide();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    const slide = slides[currentSlide];

    return (
        <section
            className="shopnest-banner"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div className="banner-container">

                {/* Background Image */}
                <div
                    className="banner-background"
                    style={{
                        backgroundImage: `url(${slide.image})`,
                    }}
                />

                {/* Dark Overlay */}
                <div className="banner-overlay" />

                {/* Content */}
                <div className="banner-content">

                    <span className="banner-tag">
                        {slide.tag}
                    </span>

                    <h1>
                        {slide.title}
                        <span>{slide.highlight}</span>
                    </h1>

                    <p>
                        {slide.description}
                    </p>

                    <Link
                        to={slide.link}
                        className="banner-button"
                    >
                        {slide.buttonText}

                        <span className="banner-button-arrow">
                            →
                        </span>
                    </Link>

                </div>

                {/* Offer Badge */}
                <div className="banner-offer">
                    <span>{slide.offer}</span>
                    <small>LIMITED TIME OFFER</small>
                </div>

                {/* Previous Button */}
                <button
                    className="banner-arrow banner-arrow-left"
                    onClick={previousSlide}
                    aria-label="Previous slide"
                >
                    ←
                </button>

                {/* Next Button */}
                <button
                    className="banner-arrow banner-arrow-right"
                    onClick={nextSlide}
                    aria-label="Next slide"
                >
                    →
                </button>

                {/* Dots */}
                <div className="banner-dots">
                    {slides.map((item, index) => (
                        <button
                            key={item.id}
                            className={`banner-dot ${
                                currentSlide === index
                                    ? "active"
                                    : ""
                            }`}
                            onClick={() => goToSlide(index)}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>

                {/* Slide Counter */}
                <div className="banner-counter">
                    <span>
                        {String(currentSlide + 1).padStart(2, "0")}
                    </span>

                    <div className="counter-line" />

                    <span>
                        {String(slides.length).padStart(2, "0")}
                    </span>
                </div>

            </div>
        </section>
    );
};

export default Banner;

