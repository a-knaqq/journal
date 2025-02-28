import React, { useEffect, useState } from 'react';

const ImageGrid = () => {
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
                const uniqueImages = [...new Set(data)];
                setImages(uniqueImages);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchImages();
    }, []);

    if (error) {
        return <p className="text-center text-red-500">Error: {error}</p>;
    }

    return (
        <div className="p-6 bg-zinc-900 min-h-screen">
            <h1 className="text-center text-white text-2xl font-bold mb-8">Image Gallery</h1>
            {images.length === 0 ? (
                <p className="text-center text-white">No images found.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {images.map((imageUrl, index) => (
                        <div key={index} className="overflow-hidden rounded-lg shadow-lg">
                            <img
                                src={imageUrl}
                                alt={`Image ${index + 1}`}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ImageGrid;
