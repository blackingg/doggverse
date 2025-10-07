import React, { useState } from "react";
import {
  IoWalletSharp,
  IoHomeSharp,
  IoMapSharp,
  IoGridSharp,
  IoGlobeSharp,
} from "react-icons/io5";
import { BalanceCard } from "../components/BalanceCard";
import { SectionHeader } from "../components/SectionHeader";
import { MissionCard } from "../components/MissionCard";
import { ReferralCard } from "../components/ReferralCard";
import { useNotifications } from "../context/NotificationContext";
import { Header } from "../components/Header";

export const EarnPage: React.FC = () => {
  const { addNotification } =
    useNotifications();

  const [balance, setBalance] = useState(500);
  const [missions, setMissions] = useState([
    {
      id: 1,
      title: "Daily Login",
      reward: 50,
      completed: false,
      description: "Log in daily to earn rewards",
    },
    {
      id: 2,
      title: "Buy First Land",
      reward: 100,
      completed: false,
      description: "Purchase your first land plot",
    },
    {
      id: 3,
      title: "Invite 5 Friends",
      reward: 250,
      completed: false,
      description: "Share your referral link",
    },
  ]);

  const claimReward = (id: number) => {
    setMissions(
      missions.map((m) => (m.id === id ? { ...m, completed: true } : m))
    );
    const mission = missions.find((m) => m.id === id);
    if (mission) {
      setBalance(balance + mission.reward);
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] pb-20">
      <Header
        title="Earn"
        balance={1200}
      />
      {/* Balance Card */}
      <div className="p-4">
        <BalanceCard balance={balance} />
      </div>

      {/* Missions */}
      <div className="px-4 mb-6">
        <SectionHeader title="Missions" />
        <div className="space-y-2">
          {missions.map((mission) => (
            <MissionCard
              key={mission.id}
              mission={mission}
              onClaim={claimReward}
            />
          ))}
        </div>
      </div>

      {/* Referral */}
      <div className="px-4">
        <ReferralCard
          friendsCount={12}
          earnedAmount={350}
          bonusPercent={7}
          onShare={() =>
            addNotification({
              type: "success",
              title: "Referral Link Shared!",
              description: "You’ve successfully shared your invite link.",
            })
          }
        />
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#1c1c1e] border-t border-gray-800 z-50">
        <div className="flex justify-around items-center h-16 max-w-7xl mx-auto">
          {[
            { id: "home", label: "Home", icon: IoHomeSharp },
            { id: "lands", label: "Lands", icon: IoMapSharp },
            { id: "earn", label: "Earn", icon: IoWalletSharp },
            { id: "gallery", label: "Gallery", icon: IoGridSharp },
            { id: "doggverse", label: "3D", icon: IoGlobeSharp },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                  tab.id === "earn" ? "text-[#0A84FF]" : "text-gray-500"
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
    </div>
  );
};

export default EarnPage;
