import React, { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

const photos = [
    {
        image: '01',
        src: 'assets/images/hotel.png',
    },
    {
        image: '02',
        src: 'assets/images/hotel.png',
    },
    {
        image: '03',
        src: 'assets/images/hotel.png',
    },
    {
        image: '04',
        src: 'assets/images/hotel.png',
    },
    {
        image: '05',
        src: 'assets/images/hotel.png',
    },
    {
        image: '06',
        src: 'assets/images/hotel.png',
    },
];

const Profilephoto: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [photoIndex, setPhotoIndex] = useState(0);

    const openLightbox = (index: number) => {
        setPhotoIndex(index);
        setIsOpen(true);
    };

    return (
        <div className="card w-100 shadow-xss rounded-xxl border-0 mb-3">
            <div className="card-body d-flex align-items-center p-4">
                <h4 className="fw-700 mb-0 font-xssss text-grey-900">Photos</h4>
                <a href="/home" className="fw-600 ms-auto font-xssss text-primary">
                    See all
                </a>
            </div>

            <div className="card-body d-block pt-0 pb-2">
                <div className="row ps-3 pe-3">
                    {photos.map((photo, index) => (
                        <div className="col-6 mb-1 p-1" key={index}>
                            <div
                                className="pointer"
                                onClick={() => openLightbox(index)}
                            >
                                <img
                                    src={photo.src}
                                    alt={`photo-${photo.image}`}
                                    className="img-fluid rounded-3 w-100"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="card-body d-block w-100 pt-0">
                <a
                    href="/home"
                    className="p-2 lh-28 w-100 d-block bg-grey text-grey-800 text-center font-xssss fw-700 rounded-xl"
                >
                    <i className="feather-external-link font-xss me-2"></i> More
                </a>
            </div>

            {isOpen && (
                <Lightbox
                    open={isOpen}
                    close={() => setIsOpen(false)}
                    index={photoIndex}
                    slides={photos.map((p) => ({ src: p.src }))}
                />
            )}
        </div>
    );
};

export default Profilephoto;
