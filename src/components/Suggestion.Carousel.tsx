"use client"
import React, { useState } from 'react'

const SuggestionCarousel = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const items = [
    'Java', 'Git', 'Live', 'Stocks', 'Public Speaking', 'Pop Music', 'Recently Uploaded', 'Java', 'Git', 'Live', 'Stocks', 'Public Speaking', 'Pop Music', 'Recently Uploaded', 'Java', 'Git', 'Live', 'Stocks', 'Public Speaking', 'Pop Music', 'Recently Uploaded', 'Java', 'Git', 'Live', 'Stocks', 'Public Speaking', 'Pop Music', 'Recently Uploaded'
  ];
  const handleScroll = (direction: 'left' | 'right') => {
    const container = document.getElementById('carousel-container');
    if (container) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setScrollPosition(container.scrollLeft + scrollAmount);
    }
  };
  return (
    <div className="sticky top-[3.5rem] border w-full h-10 flex">
      {items.map((item, index) => (
          <div
            key={index}
            className="inline-block bg-blue-500 text-white px-4 w-full py-0 rounded-lg cursor-pointer hover:bg-blue-600"
          >
            {item}
          </div>
        ))}
      {/* grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 scrollbar-thin overflow-y-auto overflow-x-hidden h-auto border space-x-4 */}
      {/* <div className="relative w-full flex items-center"> */}
      {/* <button
        onClick={() => handleScroll('left')}
        className="absolute left-0 z-10 p-2 bg-gray-100 rounded-full shadow-md focus:outline-none hover:bg-gray-200"
      >
        ←
      </button>
      <div
        id="carousel-container"
        className="flex space-x-4 w-full overflow-x-auto scrollbar-thin border-red-300 border"
      >
        {items.map((item, index) => (
          <div
            key={index}
            className="inline-block bg-blue-500 text-white px-4 w-full py-0 rounded-lg cursor-pointer hover:bg-blue-600"
          >
            {item}
          </div>
        ))}
      </div>
      <button
        onClick={() => handleScroll('right')}
        className="absolute right-0 z-10 p-2 bg-gray-100 rounded-full shadow-md focus:outline-none hover:bg-gray-200"
      >
        →
      </button> */}
    {/* </div> */}
    <div></div>
    </div>
  )
}

export default SuggestionCarousel