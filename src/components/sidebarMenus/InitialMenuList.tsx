

import React from 'react'
import { HomeSvg } from '../../../public/svgs/home'
import { ShortsSvg } from '../../../public/svgs/shorts'
import { SubscriptionsSvg } from '../../../public/svgs/subscriptions'
const initialMenuItems = [
  { icon: <HomeSvg />, label: 'Home' },
  { icon: <ShortsSvg />, label: 'Shorts' },
  { icon: <SubscriptionsSvg />, label: 'Subscriptions' },
]
const InitialMenuList = () => {
  return (
    <ul className="space-y-2 xl:border-b xl:border-gray-700 xl:pb-5 xl:px-2.5 md:px-1 mt-2">
        {initialMenuItems.map((item, index) => (
          <li key={index} className="cursor-pointer dark:fill-white fill-black flex xl:justify-start xl:flex-row md:justify-center md:flex-col gap-4 items-center hover:bg-[#2e2e2e]  xl:pl-4 py-2 xl:text-sm md:text-[10.5px] rounded-xl md:px-1">
            <span className="w-6 h-6">{item.icon}</span>
            <span className="ml-1 text-sm xl:block hidden">{item.label}</span>
          </li>
        ))}
      </ul>
  )
}

export default InitialMenuList