import React from "react";
import {
  IoGiftSharp,
  IoClose,
  IoInformationCircle,
  IoMegaphoneSharp,
  IoWarningSharp,
  IoCheckmarkCircle,
} from "react-icons/io5";

interface NotificationProps {
  type?: "mission" | "partnership" | "info" | "warning" | "success";
  title: string;
  description: string;
  onClose: () => void;
  autoClose?: boolean;
  autoCloseDelay?: number;
  stackIndex?: number;
  totalCount?: number;
}

export const Notification: React.FC<NotificationProps> = ({
  type = "info",
  title,
  description,
  onClose,
  autoClose = true,
  autoCloseDelay = 10000,
  stackIndex = 0,
  totalCount = 1,
}) => {
  const [isClosing, setIsClosing] = React.useState(false);

  React.useEffect(() => {
    if (autoClose && stackIndex === 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, autoCloseDelay);
      return () => clearTimeout(timer);
    }
  }, [autoClose, autoCloseDelay, stackIndex]);

  const config = {
    mission: {
      icon: IoGiftSharp,
      iconBg: "bg-[#0A84FF]/20",
      iconColor: "text-[#0A84FF]",
      borderColor: "border-[#0A84FF]",
    },
    partnership: {
      icon: IoMegaphoneSharp,
      iconBg: "bg-purple-500/20",
      iconColor: "text-purple-400",
      borderColor: "border-purple-500",
    },
    info: {
      icon: IoInformationCircle,
      iconBg: "bg-blue-500/20",
      iconColor: "text-blue-400",
      borderColor: "border-blue-500",
    },
    warning: {
      icon: IoWarningSharp,
      iconBg: "bg-yellow-500/20",
      iconColor: "text-yellow-400",
      borderColor: "border-yellow-500",
    },
    success: {
      icon: IoCheckmarkCircle,
      iconBg: "bg-green-500/20",
      iconColor: "text-green-400",
      borderColor: "border-green-500",
    },
  };

  const Icon = config[type].icon;

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 300);
  };

  // Calculate transform and opacity based on stack position
  const getStackStyle = () => {
    if (stackIndex === 0) {
      return {
        transform: "translateY(0) scale(1)",
        opacity: 1,
        zIndex: totalCount - stackIndex,
      };
    }
    if (stackIndex === 1) {
      return {
        transform: "translateY(-8px) scale(0.96)",
        opacity: 0.7,
        zIndex: totalCount - stackIndex,
      };
    }
    if (stackIndex === 2) {
      return {
        transform: "translateY(-16px) scale(0.92)",
        opacity: 0.4,
        zIndex: totalCount - stackIndex,
      };
    }
    return {
      transform: "translateY(-24px) scale(0.88)",
      opacity: 0.2,
      zIndex: totalCount - stackIndex,
    };
  };

  const stackStyle = getStackStyle();

  return (
    <div
      className={`absolute top-0 left-0 right-0 px-4 transition-all duration-300 ${
        stackIndex === 0 && !isClosing
          ? "animate-[slideInRight_0.5s_ease-out]"
          : ""
      } ${isClosing ? "opacity-0 translate-x-full" : ""}`}
      style={{
        transform: stackStyle.transform,
        opacity: isClosing ? 0 : stackStyle.opacity,
        zIndex: stackStyle.zIndex,
        pointerEvents: stackIndex === 0 ? "auto" : "none",
      }}
    >
      <div
        className={`bg-[#1c1c1e] border ${config[type].borderColor} rounded-2xl p-4 flex items-center justify-between shadow-lg`}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div
            className={`w-10 h-10 ${config[type].iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}
          >
            <Icon
              size={20}
              className={config[type].iconColor}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-white text-sm truncate">
              {title}
            </div>
            <div className="text-xs text-gray-400 line-clamp-2">
              {description}
            </div>
          </div>
        </div>
        {stackIndex === 0 && (
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors flex-shrink-0 ml-2 active:scale-95"
          >
            <IoClose size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

// Container component for stacked notifications
export const NotificationStack: React.FC<{
  notifications: Array<{
    id: number;
    type: "mission" | "partnership" | "info" | "warning" | "success";
    title: string;
    description: string;
  }>;
  onRemove: (id: number) => void;
  autoClose?: boolean;
  autoCloseDelay?: number;
}> = ({
  notifications,
  onRemove,
  autoClose = true,
  autoCloseDelay = 10000,
}) => {
  if (notifications.length === 0) return null;

  return (
    <div
      className="relative top-10"
      style={{ height: `${80 + (notifications.length - 1) * 8}px` }}
    >
      {notifications.map((notif, index) => (
        <Notification
          key={notif.id}
          type={notif.type}
          title={notif.title}
          description={notif.description}
          onClose={() => onRemove(notif.id)}
          autoClose={autoClose}
          autoCloseDelay={autoCloseDelay}
          stackIndex={index}
          totalCount={notifications.length}
        />
      ))}
    </div>
  );
};
