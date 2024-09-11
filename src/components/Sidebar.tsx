"use client"
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { toggleSidebar } from "@/lib/store/features/uiSlice";
import { usePathname } from "next/navigation";
import SubscriptionMenuList from "./sidebarMenus/SubscriptionMenuList";
import InitialMenuList from "./sidebarMenus/InitialMenuList";
import UserAccountMenuList from "./sidebarMenus/UserAccountMenuList";
import ExploreMenuList from "./sidebarMenus/ExploreMenuList";
import PremiumMenuList from "./sidebarMenus/PremiumMenuList";
import SettingsOtherOptionsMenuList from "./sidebarMenus/SettingsOtherOptionsMenuList";

const Sidebar = () => {
  const pathname = usePathname()
  const dispatch = useAppDispatch()
  const isSidebarOpen = useAppSelector((state) => state.ui.isSidebarOpen)
  console.log(isSidebarOpen, "SSSSSSSSSSSSSSSSSSSSSSSSSS");
  return (
    <aside className={`dark:bg-black bg-white transition-all duration-300 ${pathname !== '/' ? isSidebarOpen ? 'left-0 z-50' : 'z-50 left-[-9999px]' : 'z-0 left-0'} flex-col fixed  h-screen xl:w-[30vh] overflow-hidden transition-transform transform sm:block justify-center items-start`}>
      <div className="flex justify-between items-center px-6 sticky top-0 bg-black pb-2.5 pt-2">
        <button className={`w-6 h-6`} onClick={() => dispatch(toggleSidebar())}>
          <svg
            className={`h-full w-full dark:fill-white`}
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            viewBox="0 0 32 32"
          >
            <path d="M 4 7 L 4 9 L 28 9 L 28 7 L 4 7 z M 4 15 L 4 17 L 28 17 L 28 15 L 4 15 z M 4 23 L 4 25 L 28 25 L 28 23 L 4 23 z"></path>
          </svg>
        </button><Image
          src="/images/logo.png"
          height={30}
          width={150}
          alt="logo-svg"
          className={`rounded-full px-2 h-10`}
        /></div>
     <div className="overflow-auto h-full scrollbar-thin">
       {/* Initial menus */}
       <InitialMenuList />
      {/* You */}
      <UserAccountMenuList />
      {/* subscription */}
      <SubscriptionMenuList />
      {/* Explore */}
      <ExploreMenuList />
      {/* More from ViewTube */}
      <PremiumMenuList />
      {/* Settings and other options */}
      <SettingsOtherOptionsMenuList />
      <p className="hidden xl:block dark:text-gray-500 text-wrap w-full text-black font-semibold text-sm px-4 pt-4">About Press Copyright Contact usCreators Advertise Developers
        Terms Privacy Policy & SafetyHow YouTube worksTest new features</p>
      <div style={{ marginBottom: "200px" }}></div>
     </div>
    </aside>
  );
};

export default Sidebar;


// <aside
//   className="w-max xl:max-w-[14.76rem] scrollbar-thin bg-white left-0 z-40 h-[calc(100vh-64px)] overflow-y-auto transition-transform transform dark:bg-black py-4 hidden md:block xl:overflow-y-auto overflow-hidden xl:top-16 top-14 fixed"
// // style={{ maxHeight: "calc(100vh - 4rem)" }}
// // xl:bg-red-400 lg:bg-green-500 md:bg-blue-500 sm:bg-yellow-500
// // ☰
// >
// </aside>