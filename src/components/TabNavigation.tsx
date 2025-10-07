import React from "react";
import {
  IoHomeSharp,
  IoMapSharp,
  IoWalletSharp,
  IoGridSharp,
  IoGlobeSharp,
} from "react-icons/io5";

export const TabNavigation: React.FC<{
  activeTab: string;
  onTabChange: (tab: string) => void;
}> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: "home", label: "Home", icon: IoHomeSharp },
    { id: "lands", label: "Lands", icon: IoMapSharp },
    { id: "earn", label: "Earn", icon: IoWalletSharp },
    { id: "gallery", label: "Gallery", icon: IoGridSharp },
    { id: "doggverse", label: "3D", icon: IoGlobeSharp },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#1c1c1e] border-t border-gray-800 z-40">
      <div className="flex justify-around items-center h-16 max-w-7xl mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                activeTab === tab.id ? "text-[#0A84FF]" : "text-gray-500"
              }`}
            >
              <Icon
                size={24}
                className="mb-1"
              />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
