import { HomeSvg } from "../../public/svgs/home";
import { SubscriptionsSvg } from "../../public/svgs/subscriptions";
import { WatchLaterSvg } from "../../public/svgs/watchLater";

const MobileNavBar = () => {
    const navItems = [
      { icon: <HomeSvg />, label: 'Home' },
      { icon: <WatchLaterSvg />, label: 'Explore' },
      { icon: <SubscriptionsSvg />, label: 'Subscriptions' },
      { icon: <WatchLaterSvg />, label: 'Library' },
    ];
  
    return (
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around items-center p-2 z-10">
        {navItems.map((item, index) => (
          <button key={index} className="flex flex-col items-center">
            <span className="w-6 h-6">{item.icon}</span>
            <span className="text-xs mt-1">{item.label}</span>
          </button>
        ))}
      </nav>
    );
  };

  export default MobileNavBar