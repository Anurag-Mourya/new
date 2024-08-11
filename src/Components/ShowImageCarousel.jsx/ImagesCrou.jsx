import React, { useCallback, useEffect, useState } from "react";
import { Modal, Container } from "react-bootstrap";
import ImagesPopupCarousel from "./ImagesPopupCarousel.jsx";
import "./ImageCrou.scss";

const ImagesCrou = ({ images, showModal, closeModal }) => {
    const [currentImage, setCurrentImage] = useState(0);
    const [viewerIsOpen, setViewerIsOpen] = useState(false);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleClose = () => {
        closeModal(false);
        scrollToTop();
    };

    const loadBootstrapResources = () => {
        const bootstrapStylesheet = document.createElement("link");
        bootstrapStylesheet.rel = "stylesheet";
        bootstrapStylesheet.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css";
        document.head.appendChild(bootstrapStylesheet);

        const bootstrapScript = document.createElement("script");
        bootstrapScript.src = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js";
        bootstrapScript.integrity = "sha384-geWF76RCwLtnZ8qwWowPQNguL3RmwHVBC9FhGdlKrxdiJJigb/j/68SIy3Te4Bkz";
        bootstrapScript.crossOrigin = "anonymous";
        document.body.appendChild(bootstrapScript);

        return { bootstrapStylesheet, bootstrapScript };
    };

    const cleanupBootstrapResources = ({ bootstrapStylesheet, bootstrapScript }) => {
        document.head.removeChild(bootstrapStylesheet);
        document.body.removeChild(bootstrapScript);
    };

    useEffect(() => {
        let resources;
        if (showModal) {
            resources = loadBootstrapResources();
        }

        return () => {
            if (resources) {
                cleanupBootstrapResources(resources);
            }
        };
    }, [showModal]);

    const openLightbox = useCallback((index) => {
        setCurrentImage(index);
        setViewerIsOpen(true);
    }, []);

    const photos = images?.map((imgUrl) => ({
        src: imgUrl,
        thumbnail: imgUrl,
        title: imgUrl.split('/').pop(), // Just an example to give a title from the URL
    }));

    return (
        <>
            <Modal
                show={showModal}
                onHide={handleClose}
                backdrop="static"
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                fullscreen
            >
                <Modal.Header
                    closeButton
                    className="custom-close-btn"
                    style={{ borderBottom: "none" }}
                >
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        <div className="row">
                            <div id="colOfthhs" className="col">
                                <div className="gallery">
                                    {photos?.map((photo, index) => (
                                        <img
                                            key={index}
                                            src={photo.thumbnail}
                                            alt={photo.title}
                                            className="thumbnail"
                                            onClick={() => openLightbox(index)}
                                        />
                                    ))}
                                </div>
                                {/* <ImagesPopupCarousel
                                    photos={photos}
                                    viewerIsOpen={viewerIsOpen}
                                    closeModal={setViewerIsOpen}
                                    currentImage={currentImage}
                                    setCurrentImage={setCurrentImage}
                                /> */}
                            </div>
                        </div>
                    </Container>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default ImagesCrou;
