"use client"
import React, { useState, useRef } from 'react';

interface DescriptionSectionProps {
  description: string;
  views: number;
  uploadTime: string; // This should be the ISO string date
}

// Utility function to format the upload time
const formatUploadTime = (uploadTime: string) => {
  const now = new Date();
  const uploadDate = new Date(uploadTime);
  const differenceInSeconds = Math.floor((now.getTime() - uploadDate.getTime()) / 1000);

  if (differenceInSeconds < 60) {
    return `${differenceInSeconds} seconds ago`;
  } else if (differenceInSeconds < 3600) {
    return `${Math.floor(differenceInSeconds / 60)} minutes ago`;
  } else if (differenceInSeconds < 86400) {
    return `${Math.floor(differenceInSeconds / 3600)} hours ago`;
  } else if (differenceInSeconds < 604800) {
    return `${Math.floor(differenceInSeconds / 86400)} days ago`;
  } else if (differenceInSeconds < 2592000) {
    return `${Math.floor(differenceInSeconds / 604800)} weeks ago`;
  } else if (differenceInSeconds < 31536000) {
    return `${Math.floor(differenceInSeconds / 2592000)} months ago`;
  } else {
    return `${Math.floor(differenceInSeconds / 31536000)} years ago`;
  }
};

const DescriptionSection: React.FC<DescriptionSectionProps> = ({ description, views, uploadTime }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const descriptionRef = useRef<HTMLParagraphElement | null>(null);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const formattedUploadTime = formatUploadTime(uploadTime);

  return (
    <div className='mt-6 px-3 py-2.5 dark:bg-[#2b2b2b] bg-white rounded-lg flex flex-col'>
      <div className='flex justify-start items-center gap-x-2'>
        <h1 className='font-medium flex justify-center items-center'>{views} views</h1>
        <h1 className='font-medium flex justify-center items-center'>{formattedUploadTime}</h1>
      </div>
      <div className={`mt-4 overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-screen' : 'max-h-16'}`}>
        <p ref={descriptionRef} className={`text-black dark:text-white`}>
          {description} 
        </p>
        <span onClick={handleToggle} className='my-2 hover:text-blue-300 font-medium'>{isExpanded ? 'show Less' : '...more'}</span>
      </div>
    </div>
  );
};

export default DescriptionSection;
