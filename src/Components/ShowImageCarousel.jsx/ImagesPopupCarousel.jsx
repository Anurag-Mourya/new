import React from "react";
import "./ImagesPopupCarousel.scss";

const ImagesPopupCarousel = ({ photos, closeModal, viewerIsOpen, currentImage, setCurrentImage }) => {
    const closeLightbox = () => {
        setCurrentImage(0);
        closeModal(false);
    };

    const handlePrev = () => {
        setCurrentImage((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setCurrentImage((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
    };

    return (
        <div>
            {viewerIsOpen && (
                <div className="custom-modal">
                    <button className="close-btn" onClick={closeLightbox}>Close</button>
                    <div className="carousel">
                        <button className="nav-btn prev-btn" onClick={handlePrev}>‹</button>
                        <img src={photos[currentImage].src} alt={photos[currentImage].title} />
                        <button className="nav-btn next-btn" onClick={handleNext}>›</button>
                    </div>
                    <p className="legend">{photos[currentImage].title}</p>
                </div>
            )}
        </div>
    );
};

export default ImagesPopupCarousel;
