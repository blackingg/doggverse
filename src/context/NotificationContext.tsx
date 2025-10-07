import React, { createContext, useContext, useState, useCallback } from "react";

export interface NotificationItem {
  id: number;
  type: "mission" | "partnership" | "info" | "warning" | "success";
  title: string;
  description: string;
}

interface NotificationContextType {
  notifications: NotificationItem[];
  addNotification: (notification: Omit<NotificationItem, "id">) => void;
  removeNotification: (id: number) => void;
  clearAllNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 1,
      type: "mission",
      title: "New Mission Available!",
      description: "Fish in River - Earn 50 $DOGG",
    },
    {
      id: 2,
      type: "info",
      title: "Welcome to DoggEarth!",
      description: "Start exploring and earning rewards",
    },
  ]);
  const [nextId, setNextId] = useState(3);

  const addNotification = useCallback(
    (notification: Omit<NotificationItem, "id">) => {
      const newNotification = { ...notification, id: nextId };
      setNotifications((prev) => [newNotification, ...prev]);
      setNextId((prev) => prev + 1);
    },
    [nextId]
  );

  const removeNotification = useCallback((id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        clearAllNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within NotificationProvider"
    );
  }
  return context;
};
