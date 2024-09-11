"use client"

import { useState } from 'react';

const images = [
  '/image1.jpg',
  '/image2.jpg',
  '/image3.jpg',
];

export default function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
  };

  const nextSlide = () => {
    setCurrentIndex(currentIndex === images.length - 1 ? 0 : currentIndex + 1);
  };

  return (
    <div className="relative w-full h-64 bg-gray-800 dark:bg-gray-700 overflow-hidden">
      {/* Slides */}
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-transform transform ${
            index === currentIndex ? 'translate-x-0' : 'translate-x-full'
          }`}
          style={{
            backgroundImage: `url(${image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      ))}

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 p-2 bg-gray-900 text-white"
      >
        Prev
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 p-2 bg-gray-900 text-white"
      >
        Next
      </button>
    </div>
  );
}
