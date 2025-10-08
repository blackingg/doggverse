import React, { useState } from "react";
import { TabNavigation } from "./components/TabNavigation";
import { HomePage } from "./pages/HomePage";
import { LandsPage } from "./pages/LandsPage";
import { EarnPage } from "./pages/EarnPage";
import { ComingSoon } from "./pages/ComingSoon";
import { NotificationProvider } from "./context/NotificationContext";
import { DashboardPage } from "./pages/DashboardPage";

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState("home");

  const renderPage = () => {
    switch (activeTab) {
      case "home":
        return <HomePage onNavigate={setActiveTab} />;
      case "earn":
        return <EarnPage />;
      case "doggverse":
        return (
          <ComingSoon
            title="Doggverse 3D"
            description="Immersive 3D metaverse experience coming soon"
          />
        );
      case "lands":
        return <LandsPage />;
      case "dashboard":
        return <DashboardPage />;
      default:
        return <HomePage onNavigate={setActiveTab} />;
    }
  };

  return (
    <NotificationProvider>
      <div className="min-h-screen bg-[#000000]">
        {renderPage()}
        <TabNavigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>
    </NotificationProvider>
  );
};

export default App;
