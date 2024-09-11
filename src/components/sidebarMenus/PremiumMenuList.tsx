

import React from 'react'
import { HomeSvg } from '../../../public/svgs/home'
const PremiumMenuListItems = [
    { icon: <HomeSvg />, label: 'ViewTube premium' },
    { icon: <HomeSvg />, label: 'ViewTube studio' },
    { icon: <HomeSvg />, label: 'ViewTube Music' },
    { icon: <HomeSvg />, label: 'ViewTube kids' },
  ]
const PremiumMenuList = () => {
  return (
    <ul className="space-y-2 xl:border-b xl:border-gray-700 xl:pb-5 xl:px-2.5 md:px-1 mt-2">
        <li className="cursor-pointer dark:fill-white fill-black flex xl:justify-start xl:flex-row md:justify-center md:flex-col gap-4 items-center hover:bg-[#2e2e2e]  xl:pl-4 py-2 xl:text-sm md:text-[10.5px] rounded-xl md:px-1 font-semibold">
          <span>More from ViewTube</span>
        </li>
        {PremiumMenuListItems.map((item, index) => (
          <li key={index} className="cursor-pointer dark:fill-white fill-black flex xl:justify-start xl:flex-row md:justify-center md:flex-col gap-4 items-center hover:bg-[#2e2e2e]  xl:pl-4 py-2 xl:text-sm md:text-[10.5px] rounded-xl md:px-1">
            <span className="w-6 h-6">{item.icon}</span>
            <span className="ml-1 text-sm xl:block hidden">{item.label}</span>
          </li>
        ))}
      </ul>
  )
}

export default PremiumMenuList