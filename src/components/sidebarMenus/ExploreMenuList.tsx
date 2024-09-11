
import React from 'react'
import { TrendingSvg } from '../../../public/svgs/trending'
import { ShoppingsSvg } from '../../../public/svgs/shopping'
import { MusicSvg } from '../../../public/svgs/music'
import { MoviesSvg } from '../../../public/svgs/movies'
import { GamingSvg } from '../../../public/svgs/gaming'
import { NewsSvg } from '../../../public/svgs/news'
import { LivesSvg } from '../../../public/svgs/lives'
import { SportsSvg } from '../../../public/svgs/sports'
import { CoursesSvg } from '../../../public/svgs/courses'
import { FashionSvg } from '../../../public/svgs/fashion'
import { PodCastSvg } from '../../../public/svgs/podcast'

const ExploreListMenuItems = [
    { icon: <TrendingSvg />, label: 'Trending' },
    { icon: <ShoppingsSvg />, label: 'Shopping' },
    { icon: <MusicSvg />, label: 'Musics' },
    { icon: <MoviesSvg />, label: 'Movies' },
    { icon: <LivesSvg />, label: 'Lives' },
    { icon: <GamingSvg />, label: 'Gaming' },
    { icon: <NewsSvg />, label: 'News' },
    { icon: <SportsSvg />, label: 'Sports' },
    { icon: <CoursesSvg />, label: 'Courses' },
    { icon: <FashionSvg />, label: 'Fashion & Beauty' },
    { icon: <PodCastSvg />, label: 'Podcasts' },
  ]
const ExploreMenuList = () => {
  return (
    <ul className="space-y-2 xl:border-b xl:border-gray-700 xl:pb-5 xl:px-2.5 md:px-1 mt-2">
        <li className="cursor-pointer dark:fill-white fill-black flex xl:justify-start xl:flex-row md:justify-center md:flex-col gap-4 items-center hover:bg-[#2e2e2e]  xl:pl-4 py-2 xl:text-sm md:text-[10.5px] rounded-xl md:px-1 font-semibold">
          <span>Explore</span>
        </li>
        {ExploreListMenuItems.map((item, index) => (
          <li key={index} className="cursor-pointer dark:fill-white fill-black flex xl:justify-start xl:flex-row md:justify-center md:flex-col gap-4 items-center hover:bg-[#2e2e2e]  xl:pl-4 py-2 xl:text-sm md:text-[10.5px] rounded-xl md:px-1">
            <span className="w-6 h-6">{item.icon}</span>
            <span className="ml-1 text-sm xl:block hidden">{item.label}</span>
          </li>
        ))}
      </ul>
  )
}

export default ExploreMenuList