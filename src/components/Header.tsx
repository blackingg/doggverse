import React from "react";
import { IoWalletSharp } from "react-icons/io5";
import { useNotifications } from "../context/NotificationContext";
import { NotificationStack } from "./Notification";

export const Header: React.FC<{ title: string; balance?: number }> = ({
  title,
  balance,
}) => {
  const { notifications, removeNotification } = useNotifications();
  return (
    <div className="sticky top-0 bg-[#000000] border-b border-gray-800 z-40">
      <div className="absolute top-8 left-0 right-0 z-50">
        <NotificationStack
          notifications={notifications}
          onRemove={removeNotification}
          autoClose={true}
          autoCloseDelay={10000}
        />
      </div>
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-white">{title}</h1>
          {balance !== undefined && (
            <div className="flex items-center gap-2 bg-[#0A84FF] text-white px-4 py-2 rounded-full">
              <IoWalletSharp size={16} />
              <span className="font-semibold">{balance}</span>
              <span className="text-xs opacity-90">DOGG</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
