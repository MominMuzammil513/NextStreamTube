import { useState } from "react";
import Image from "next/image";

const SubscriptionMenuList = () => {
  // Generate an array of 100 subscription items
  const subscriptions = Array(100)
    .fill(null)
    .map((_, index) => ({
      id: index + 1,
      name: `Subscription ${index + 1}`,
      imgSrc: "/images/my-pic1.png", // same image for all
    }));

  const ITEMS_PER_PAGE = 7; // Number of items to show at a time
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  // Function to load more items
  const showMoreItems = () => {
    setVisibleCount((prevCount) => prevCount + ITEMS_PER_PAGE);
  };

  return (
    <ul className="space-y-2 xl:border-b xl:border-gray-700 xl:pb-5 xl:px-2.5 md:px-1 mt-2">
      {/* Map over the subscriptions array but show only the number of visible items */}
      {subscriptions.slice(0, visibleCount).map((item) => (
        <li
          key={item.id}
          className="cursor-pointer dark:fill-white fill-black flex xl:justify-start xl:flex-row md:justify-center md:flex-col gap-4 items-center hover:bg-[#2e2e2e]  xl:pl-4 py-2.5 xl:text-sm md:text-[10.5px] rounded-xl md:px-1"
        >
          <Image
            src={item.imgSrc}
            width={100}
            height={100}
            alt={`${item.name}-profile-image`}
            className="h-5 w-5 bg-white rounded-full"
          />
          <span className="ml-1 ">{item.name}</span>
        </li>
      ))}

      {/* "Show more" button, only show if there are more items to load */}
      {visibleCount < subscriptions.length && (
        <li
          className="cursor-pointer dark:fill-white fill-black flex xl:justify-start xl:flex-row md:justify-center md:flex-col gap-4 items-center hover:bg-[#2e2e2e]  xl:pl-4 py-2 xl:text-sm md:text-[10.5px] rounded-xl md:px-1"
          onClick={showMoreItems}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#e8eaed"
          >
            <path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z" />
          </svg>
          <span className="ml-1">Show more</span>
        </li>
      )}
    </ul>
  );
};

export default SubscriptionMenuList;
