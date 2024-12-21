import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';

const ImageCarousel = () => {
    const [images, setImages] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await fetch('https://849fmpczll.execute-api.us-east-1.amazonaws.com/portfolio-backend'); // Replace with your actual API endpoint
                if (!response.ok) {
                    throw new Error('Failed to fetch images');
                }
                const data = await response.json();
                setImages(data);
            } catch (err) {
                setError(err.message);
            }
        };
        fetchImages();
    }, []);

    if (error) {
        return <p>Error: {error}</p>;
    }

    // Slider settings
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3, // Number of images to show
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    dots: true,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    dots: true,
                },
            },
        ],
    };

    return (
        <div>
            {images.length === 0 ? (
                <p>No images found.</p>
            ) : (
                <Slider {...settings}>
                    {images.map((imageKey) => (
                        <div key={imageKey}>
                            <img
                                src={`https://${process.env.REACT_APP_S3_BUCKET_NAME}.s3.amazonaws.com/${imageKey}`} // Construct the image URL
                                alt={imageKey}
                                style={{ width: '100%', height: 'auto' }} // Adjust image styling
                            />
                        </div>
                    ))}
                </Slider>
            )}
        </div>
    );
};

export default ImageCarousel;