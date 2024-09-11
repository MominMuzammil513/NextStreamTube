

import React from 'react'
import { YourChannelSvg } from '../../../public/svgs/yourChennel'
import { HistorySvg } from '../../../public/svgs/history'
import { PlayListSvg } from '../../../public/svgs/playlists'
import { YourVideosSvg } from '../../../public/svgs/yourVideos'
import { WatchLaterSvg } from '../../../public/svgs/watchLater'
import { LikedVideosSvg } from '../../../public/svgs/likedVideos'
import { ArrowSvg } from '../../../public/svgs/arrowRight'
const UserAccountMenuItems2 = [
    { icon: <YourChannelSvg />, label: 'Your channel' },
    { icon: <HistorySvg />, label: 'History' },
    { icon: <PlayListSvg />, label: 'PlayLists' },
    { icon: <YourVideosSvg />, label: 'Your videos' },
    { icon: <WatchLaterSvg />, label: 'Watch later' },
    { icon: <LikedVideosSvg />, label: 'Liked videos' },
  ]
const UserAccountMenuList = () => {
  return (
    <ul className="space-y-2 xl:border-b xl:border-gray-700 xl:pb-5 xl:px-2.5 md:px-1 mt-2">
        <li className="cursor-pointer dark:fill-white fill-black flex xl:justify-start xl:flex-row md:justify-center md:flex-col gap-4 items-center hover:bg-[#2e2e2e]  xl:pl-4 py-2 xl:text-sm md:text-[10.5px] rounded-xl md:px-1">
          <span>You</span>{" "}
          <ArrowSvg/>
        </li>
        {UserAccountMenuItems2.map((item, index) => (
          <li key={index} className="cursor-pointer dark:fill-white fill-black flex xl:justify-start xl:flex-row md:justify-center md:flex-col gap-4 items-center hover:bg-[#2e2e2e]  xl:pl-4 py-2 xl:text-sm md:text-[10.5px] rounded-xl md:px-1">
            <span className="w-6 h-6">{item.icon}</span>
            <span className="ml-1 text-sm xl:block hidden">{item.label}</span>
          </li>
        ))}
      </ul>
  )
}

export default UserAccountMenuList