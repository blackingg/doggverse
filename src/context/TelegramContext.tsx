import React, { createContext, useContext, useEffect, useState } from "react";

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

interface TelegramContextType {
  webApp: any;
  user: TelegramUser | null;
  isReady: boolean;
}

const TelegramContext = createContext<TelegramContextType>({
  webApp: null,
  user: null,
  isReady: false,
});

export const useTelegram = () => useContext(TelegramContext);

export const TelegramProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [webApp, setWebApp] = useState<any>(null);
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Check if Telegram Web App is available
    const tg = (window as any).Telegram?.WebApp;

    if (tg) {
      tg.ready();
      tg.expand();

      // Apply Telegram theme colors
      document.documentElement.style.setProperty(
        "--tg-theme-bg-color",
        tg.themeParams.bg_color || "#000000"
      );
      document.documentElement.style.setProperty(
        "--tg-theme-text-color",
        tg.themeParams.text_color || "#ffffff"
      );
      document.documentElement.style.setProperty(
        "--tg-theme-button-color",
        tg.themeParams.button_color || "#0A84FF"
      );

      setWebApp(tg);
      setUser(tg.initDataUnsafe?.user || null);
      setIsReady(true);

      // Enable closing confirmation
      tg.enableClosingConfirmation();
    } else {
      // Development mode - set dummy data
      setIsReady(true);
      console.warn(
        "Telegram Web App not detected. Running in development mode."
      );
    }
  }, []);

  return (
    <TelegramContext.Provider value={{ webApp, user, isReady }}>
      {children}
    </TelegramContext.Provider>
  );
};
