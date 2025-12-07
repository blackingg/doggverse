import React, { useState, useEffect } from "react";
import { TabNavigation } from "./components/TabNavigation";
import { HomePage } from "./pages/HomePage";
import { LandsPage } from "./pages/LandsPage";
import { EarnPage } from "./pages/EarnPage";
import { NotificationProvider } from "./context/NotificationContext";
import { DashboardPage } from "./pages/DashboardPage";
import { TelegramProvider } from "./context/TelegramContext";
import { LandsPageAlt } from "./pages/LandsPageAlt";
import { AppDataProvider } from "./context/AppDataContext";

declare global {
  interface Window {
    Telegram?: {
      WebApp: any;
    };
  }
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState("home");

  useEffect(() => {
    // Inject safe area CSS
    const style = document.createElement("style");
    style.textContent = `
      :root {
        --tg-safe-area-inset-top: env(safe-area-inset-top, 0px);
        --tg-safe-area-inset-bottom: env(safe-area-inset-bottom, 0px);
        --tg-safe-area-inset-left: env(safe-area-inset-left, 0px);
        --tg-safe-area-inset-right: env(safe-area-inset-right, 0px);
        --tg-viewport-height: 100vh;
      }
      
      html, body {
        height: 100%;
        overflow: hidden;
        position: fixed;
        width: 100%;
      }
      
      #root {
        height: 100%;
        overflow: auto;
        -webkit-overflow-scrolling: touch;
      }
      
      @supports (-webkit-touch-callout: none) {
        :root {
          --tg-viewport-height: -webkit-fill-available;
        }
      }
      
      /* Add meta viewport for safe area */
      meta[name="viewport"] {
        content: "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover";
      }
    `;
    document.head.appendChild(style);

    // Update viewport meta tag
    let viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
      viewport = document.createElement("meta");
      viewport.setAttribute("name", "viewport");
      document.head.appendChild(viewport);
    }
    viewport.setAttribute(
      "content",
      "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
    );

    // Initialize Telegram WebApp
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();
      tg.enableClosingConfirmation();

      tg.onEvent("viewportChanged", () => {
        document.documentElement.style.setProperty(
          "--tg-viewport-height",
          `${tg.viewportHeight}px`
        );
      });
    }

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const renderPage = () => {
    switch (activeTab) {
      case "home":
        return <HomePage onNavigate={setActiveTab} />;
      case "earn":
        return <EarnPage />;
      case "doggverse":
        return <LandsPageAlt />;
      case "lands":
        return <LandsPage />;
      case "dashboard":
        return <DashboardPage />;
      default:
        return <HomePage onNavigate={setActiveTab} />;
    }
  };

  return (
    <TelegramProvider>
      <AppDataProvider>
        <NotificationProvider>
          <div
            className="min-h-screen bg-[#000000]"
            style={{
              minHeight: "var(--tg-viewport-height)",
              paddingLeft: "var(--tg-safe-area-inset-left)",
              paddingRight: "var(--tg-safe-area-inset-right)",
            }}
          >
            {renderPage()}
            <TabNavigation
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>
        </NotificationProvider>
      </AppDataProvider>
    </TelegramProvider>
  );
};

export default App;
