

import React from 'react'
import { SettingsSvg } from '../../../public/svgs/settings'
import { ReportHistorySvg } from '../../../public/svgs/reportHistory'
import { HelpSvg } from '../../../public/svgs/help'
import { FeedbackSvg } from '../../../public/svgs/feedback'
const SettingsOtherOptionsMenuListItems = [
    { icon: <SettingsSvg />, label: 'Settings' },
    { icon: <ReportHistorySvg />, label: 'Report history' },
    { icon: <HelpSvg />, label: 'Help' },
    { icon: <FeedbackSvg />, label: 'Send feedback' },
  ]
const SettingsOtherOptionsMenuList = () => {
  return (
    <ul className="space-y-2 xl:border-b xl:border-gray-700 xl:pb-5 xl:px-2.5 md:px-1 mt-2">
        {SettingsOtherOptionsMenuListItems.map((item, index) => (
          <li key={index} className="cursor-pointer dark:fill-white fill-black flex xl:justify-start xl:flex-row md:justify-center md:flex-col gap-4 items-center hover:bg-[#2e2e2e]  xl:pl-4 py-2 xl:text-sm md:text-[10.5px] rounded-xl md:px-1">
            <span className="w-6 h-6">{item.icon}</span>
            <span className="ml-1 text-sm xl:block hidden">{item.label}</span>
          </li>
        ))}
      </ul>
  )
}

export default SettingsOtherOptionsMenuList