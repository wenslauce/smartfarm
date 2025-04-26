import React, { useRef, useState } from "react";
import {
  ChevronRight,
  ChevronLeft,
  Bot,
  Worm,
  Crop,
  Flashlight,
  User,
  Power,
  Warehouse,
  VeganIcon,
  WheatIcon,
} from "lucide-react";
import { Link, useNavigate, Outlet } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CloudSunRain } from "lucide-react";
import { Sprout } from "lucide-react";

function Layout() {
  const navigate = useNavigate();
  const navRef = useRef(null);
  const navItems = [
    { label: "Home", path: "/dashboard", icon: CloudSunRain },
    { label: "Chatbot", path: "/dashboard/bot", icon: Bot },
    { label: "Diseases", path: "/dashboard/diseases", icon: Sprout },
    { label: "Yield", path: "/dashboard/yield", icon: WheatIcon },
    { label: "Fertilizers", path: "/dashboard/fertilizers", icon: Crop},
    {
      label: "Crop Recommendation",
      path: "/dashboard/crop-recommendation",
      icon: VeganIcon,
    },
    {
      label: "Inventory",
      path: "/dashboard/inventory",
      icon: Warehouse,
    },
  ];
  const [isExpanded, setisExpanded] = useState(false);
  const [activeTab, setactiveTab] = useState(navItems[0].label);

  const handletogglebar = () => {
    setisExpanded(!isExpanded);
  };

  const handleLogout = () => {
    // Clear all auth data
    sessionStorage.removeItem('isAuthenticated');
    sessionStorage.removeItem('isDemoUser');
    sessionStorage.removeItem('demoUser');
    localStorage.removeItem('isAuthenticated');
    
    // Navigate to home
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div
        ref={navRef}
        className={`h-screen bg-gray-50 flex flex-col border-r bg-gradient-to-r from-lightBlue-400 to-blue-800 shadow-md transition-all duration-300 ease-in-out fixed top-0 left-0 ${
          isExpanded ? "w-64" : "w-20"
        } z-20`}
      >
        {/* Toggle Button */}
        <button
          onClick={handletogglebar}
          className="absolute -right-3 top-20 transform bg-white rounded-full p-1 border border-gray-300 z-20 shadow-md hover:bg-gray-100 transition-colors duration-200"
        >
          {isExpanded ? (
            <ChevronLeft
              size={20}
              strokeWidth={1.5}
              className="text-gray-600"
            />
          ) : (
            <ChevronRight
              size={20}
              strokeWidth={1.5}
              className="text-gray-600"
            />
          )}
        </button>

        {/* Logo */}
        <div className="flex-shrink-0 flex items-center justify-center h-16 border-b border-gray-200">
          <div className="h-10 w-10 bg-green-200 rounded-md border border-green-300 flex items-center justify-center">
            <span className="text-green-800 font-bold text-lg">A</span>
          </div>
        </div>

        {/* Nav Container with flex-col */}
        <div className="flex flex-col h-full">
          {/* Nav Items */}
          <nav className="flex flex-col items-center space-y-1 py-4">
            {navItems.map((item, index) => (
              <React.Fragment key={index}>
                {index === 3 || index === 6 || index === 9 ? (
                  <div
                    className={`my-2 h-px bg-gray-300 ${
                      isExpanded ? "w-52" : "w-10"
                    }`}
                  ></div>
                ) : null}
                <Link
                  to={item.path}
                  className={`relative flex items-center hover:bg-gray-100 transition-colors duration-200 rounded-md
                    ${
                      isExpanded
                        ? "w-52 justify-start px-4"
                        : "w-14 justify-center"
                    }
                    ${
                      activeTab === item.label
                        ? "text-blue-600"
                        : "text-gray-600"
                    }
                    py-3`}
                  onClick={() => setactiveTab(item.label)}
                >
                  <item.icon
                    size={20}
                    strokeWidth={1.5}
                    className={
                      activeTab === item.label
                        ? "text-blue-600"
                        : "text-gray-500"
                    }
                  />
                  {isExpanded && (
                    <span className="ml-4 text-sm font-medium whitespace-nowrap overflow-hidden">
                      {item.label}
                    </span>
                  )}
                </Link>
              </React.Fragment>
            ))}
          </nav>

          {/* Spacer */}
          <div className="flex-grow"></div>

          {/* Avatar section */}
          <div className="flex flex-col items-center justify-center gap-3">
            <button
              onClick={handleLogout}
              className="hover:bg-gray-100 p-2 rounded-full transition-colors duration-200"
            >
              <Power
                size={20}
                strokeWidth={1.5}
                className="text-red-700 cursor-pointer"
              />
            </button>

            <Link to="/dashboard/profile">
              <div className="p-4 border-t border-gray-200">
                <div
                  className={`flex items-center ${
                    isExpanded ? "px-4" : "justify-center"
                  }`}
                >
                  <Avatar className="h-10 w-10 border-2 border-white">
                    <AvatarImage
                      src="https://wp.alithemes.com/html/evara/evara-frontend/assets/imgs/page/avatar-6.jpg"
                      alt="User avatar"
                    />
                    <AvatarFallback>
                      <User className="h-6 w-6 text-gray-400" />
                    </AvatarFallback>
                  </Avatar>
                  {isExpanded && (
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-100">
                        John Doe
                      </p>
                      <p className="text-xs text-gray-300">john@example.com</p>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      <ScrollArea
        className={`flex-1 overflow-y-hidden transition-all duration-300 ${
          isExpanded ? "ml-64" : "ml-20"
        }`}
      >
        <main className="p-6">
          <Outlet />
        </main>
      </ScrollArea>
    </div>
  );
}

export default Layout;
