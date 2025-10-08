import React, { useState } from "react";
import { BalanceCard } from "../components/BalanceCard";
import { SectionHeader } from "../components/SectionHeader";
import { MissionCard } from "../components/MissionCard";
import { ReferralCard } from "../components/ReferralCard";
import { useNotifications } from "../context/NotificationContext";
import { Header } from "../components/Header";

export const EarnPage: React.FC = () => {
  const { addNotification } = useNotifications();

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
        balance={500}
      />

      <div className="p-4">
        <BalanceCard balance={balance} />
      </div>

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

      <div className="px-4">
        <ReferralCard
          friendsCount={12}
          earnedAmount={350}
          bonusPercent={7}
          onShare={() => {
            addNotification({
              type: "success",
              title: "Referral Link Copied!",
              description:
                "Share with friends to earn 7% bonus on their purchases",
            });
          }}
        />
      </div>
    </div>
  );
};

export default EarnPage;
