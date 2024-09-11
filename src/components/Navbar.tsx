'use client';

import { toggleSidebar } from "@/lib/store/features/uiSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import Image from "next/image";
import { useState } from "react";

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useAppDispatch()
  const isSidebarOpen = useAppSelector((state) => state.ui.isSidebarOpen)
  const handleSearch = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    console.log("Searching for:", searchTerm);
    // Implement search functionality here
  };

  return (
    <nav className="bg-white dark:bg-black shadow-md fixed right-0 left-0 top-0 z-20 px-6">
      <div className="py-2 flex justify-between items-center w-full">
        <div className="flex justify-between items-center">
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
          <div className="w-1/2 gap-x-2 flex dark:bg-black dark:fill-white fill-black justify-center items-center">
        <form onSubmit={handleSearch} className="w-full flex dark:bg-black border rounded-full border-[#434141] ml-0.5 max-w-xl">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 outline-none appearance-none dark:bg-black rounded-l-full pl-5 focus:border-2 focus:border-[#2c6be9]"
          />
          <button type="submit" className="bg-[#2e2e2e] py-2 px-7 rounded-r-full">
          <svg
                className="w-4 h-4"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
          </button>
        </form>
        <svg xmlns="http://www.w3.org/2000/svg" className="bg-[#2e2e2e]  rounded-full p-2 h-10 w-10"viewBox="0 -960 960 960"><path d="M480-420q-41.92 0-70.96-29.04Q380-478.08 380-520v-240q0-41.92 29.04-70.96Q438.08-860 480-860q41.92 0 70.96 29.04Q580-801.92 580-760v240q0 41.92-29.04 70.96Q521.92-420 480-420Zm0-220Zm-30 510v-131.85q-99-11.31-164.5-84.92Q220-420.39 220-520h60q0 83 58.5 141.5T480-320q83 0 141.5-58.5T680-520h60q0 99.61-65.5 173.23Q609-273.16 510-261.85V-130h-60Zm30-350q17 0 28.5-11.5T520-520v-240q0-17-11.5-28.5T480-800q-17 0-28.5 11.5T440-760v240q0 17 11.5 28.5T480-480Z"/></svg>
          </div>
        <div className="flex space-x-4">
          {/* <button className="fill-blue-600 text-sm font-semibold text-blue-600 flex justify-between items-center px-2 py-1 gap-x-1 border-2 border-blue-600 rounded-full"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="M240.92-268.31q51-37.84 111.12-59.77Q412.15-350 480-350t127.96 21.92q60.12 21.93 111.12 59.77 37.3-41 59.11-94.92Q800-417.15 800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 62.85 21.81 116.77 21.81 53.92 59.11 94.92ZM480.01-450q-54.78 0-92.39-37.6Q350-525.21 350-579.99t37.6-92.39Q425.21-710 479.99-710t92.39 37.6Q610-634.79 610-580.01t-37.6 92.39Q534.79-450 480.01-450ZM480-100q-79.15 0-148.5-29.77t-120.65-81.08q-51.31-51.3-81.08-120.65Q100-400.85 100-480t29.77-148.5q29.77-69.35 81.08-120.65 51.3-51.31 120.65-81.08Q400.85-860 480-860t148.5 29.77q69.35 29.77 120.65 81.08 51.31 51.3 81.08 120.65Q860-559.15 860-480t-29.77 148.5q-29.77 69.35-81.08 120.65-51.3 51.31-120.65 81.08Q559.15-100 480-100Zm0-60q54.15 0 104.42-17.42 50.27-17.43 89.27-48.73-39-30.16-88.11-47Q536.46-290 480-290t-105.77 16.65q-49.31 16.66-87.92 47.2 39 31.3 89.27 48.73Q425.85-160 480-160Zm0-350q29.85 0 49.92-20.08Q550-550.15 550-580t-20.08-49.92Q509.85-650 480-650t-49.92 20.08Q410-609.85 410-580t20.08 49.92Q450.15-510 480-510Zm0-70Zm0 355Z"/></svg><span>Sign In</span></button> */}
          <ul className="dark:fill-white fill-black flex justify-between items-center gap-4">
          <li><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="M379.62-330h60v-120h120v-60h-120v-120h-60v120h-120v60h120v120Zm-197.7 150q-30.3 0-51.3-21-21-21-21-51.31v-455.38q0-30.31 21-51.31 21-21 51.3-21h455.39q30.3 0 51.3 21 21 21 21 51.31v183.08l140.77-140.77v370.76L709.61-435.39v183.08q0 30.31-21 51.31-21 21-51.3 21H181.92Zm0-60h455.39q5.38 0 8.84-3.46 3.47-3.46 3.47-8.85v-455.38q0-5.39-3.47-8.85-3.46-3.46-8.84-3.46H181.92q-5.38 0-8.84 3.46t-3.46 8.85v455.38q0 5.39 3.46 8.85t8.84 3.46Zm-12.3 0v-480 480Z"/></svg></li>
          <li><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="M180-204.62v-59.99h72.31v-298.47q0-80.69 49.81-142.69 49.8-62 127.88-79.31V-810q0-20.83 14.57-35.42Q459.14-860 479.95-860q20.82 0 35.43 14.58Q530-830.83 530-810v24.92q78.08 17.31 127.88 79.31 49.81 62 49.81 142.69v298.47H780v59.99H180Zm300-293.07Zm-.07 405.38q-29.85 0-51.04-21.24-21.2-21.24-21.2-51.07h144.62q0 29.93-21.26 51.12-21.26 21.19-51.12 21.19Zm-167.62-172.3h335.38v-298.47q0-69.46-49.11-118.57-49.12-49.12-118.58-49.12-69.46 0-118.58 49.12-49.11 49.11-49.11 118.57v298.47Z"/></svg></li>
          <li><Image src={"/images/my-pic1.png"} width={100} height={100} alt="subscriptions-profile-image" className="h-8 w-8 bg-white rounded-full"/></li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

