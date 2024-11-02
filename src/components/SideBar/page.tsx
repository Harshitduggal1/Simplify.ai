"use client";

import { FC } from "react";
import { motion } from "framer-motion";
import { 
  Home as HomeIcon, 
  Rocket as RocketIcon, 
  Mail as MailIcon, 
  FileText as FileTextIcon, 
  BarChart as BarChartIcon, 
  File as FileIcon, 
  MessageCircle as MessageCircleIcon, 
  Settings as SettingsIcon 
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface SidebarItem {
  id: number;
  name: string;
  icon: React.ReactNode;
  path: string;
}

const menuItems: SidebarItem[] = [
  { id: 1, name: "Dashboard", icon: <HomeIcon className="w-6 h-6 text-blue-500" />, path: "/dashboard" },
  { id: 2, name: "YouTube to Blog⚡️", icon: <RocketIcon className="w-6 h-6 text-yellow-500" />, path: "/dashboard/youtube-blogs" },
  { id: 3, name: "Email Marketing", icon: <MailIcon className="w-6 h-6 text-green-500" />, path: "/dashboard/email-marketing" },
  { id: 4, name: "AI Files", icon: <FileTextIcon className="w-6 h-6 text-purple-500" />, path: "/dashboard/ai-files" },
  { id: 5, name: "Data Extraction", icon: <BarChartIcon className="w-6 h-6 text-red-500" />, path: "/dashboard/data-extraction" },
  { id: 6, name: "Blogs", icon: <FileIcon className="w-6 h-6 text-orange-500" />, path: "/posts" },
  { id: 7, name: "Feedback", icon: <MessageCircleIcon className="w-6 h-6 text-teal-500" />, path: "/dashboard/feedback" },
  { id: 8, name: "Settings", icon: <SettingsIcon className="w-6 h-6 text-gray-500" />, path: "/settings" }
];

const ModernSidebar: FC = () => {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/dashboard" && pathname === "/dashboard") return true;
    if (path !== "/dashboard") return pathname.startsWith(path);
    return false;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <motion.aside 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="fixed w-80 h-screen bg-white border-r border-gray-200 shadow-lg z-50"
      >
        {/* Logo */}
        <div className="p-8 flex items-center">
          <img src="/icons/logo.png" alt="Logo" className="w-10 h-10 mr-2" />
          <motion.div 
            className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            simplify.AI
          </motion.div>
        </div>

        {/* Navigation */}
        <nav className="px-4 py-4 space-y-2 h-[calc(100vh-240px)] overflow-y-auto">
          {menuItems.map((item) => (
            <Link href={item.path} key={item.id}>
              <motion.div
                whileHover={{ scale: 1.05, x: 6 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  w-full px-6 py-4 rounded-xl flex items-center gap-4 cursor-pointer
                  transition-all duration-200 ease-in-out
                  ${isActive(item.path)
                    ? "bg-gradient-to-r from-purple-100 via-purple-50 to-indigo-50 text-indigo-700 shadow-lg shadow-indigo-500/10"
                    : "hover:bg-gradient-to-r hover:from-purple-50 hover:via-indigo-50 hover:to-indigo-100 text-gray-600 hover:text-indigo-600"
                  }
                  group relative
                `}
              >
                <span className={`
                  relative z-10 transition-all duration-300
                  ${isActive(item.path) ? "text-indigo-600" : "text-gray-500 group-hover:text-indigo-500"}
                `}>
                  {item.icon}
                </span>
                
                <span className={`
                  font-medium tracking-wide transition-all duration-300
                  ${isActive(item.path) ? "text-indigo-600" : "text-gray-600 group-hover:text-indigo-500"}
                `}>
                  {item.name}
                </span>

                {isActive(item.path) && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute right-3 w-2 h-2 rounded-full bg-indigo-600"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300 }}
                  />
                )}
              </motion.div>
            </Link>
          ))}
        </nav>

        {/* Upgrade Button */}
        <div className="absolute bottom-0 left-0 w-full p-4 bg-white border-t border-gray-100">
          <motion.div 
            className="p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200"
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <div className="text-base font-semibold text-indigo-700">
              Pro Features
            </div>
            <div className="text-sm text-gray-600 mt-1">
              Unlock premium capabilities
            </div>
            <Link href="/pricing" className="block mt-3">
              <motion.button 
                className="w-full px-4 py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium text-sm hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Upgrade Now
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 ml-80 p-8 bg-gray-50">
        {/* Content goes here */}
      </div>
    </div>
  );
};
export default ModernSidebar;