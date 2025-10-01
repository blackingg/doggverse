import React, { useState } from "react";
import {
  IoWalletSharp,
  IoTrendingUpSharp,
  IoAddSharp,
  IoGiftSharp,
  IoCheckmark,
  IoPeopleSharp,
  IoShareSocialSharp,
} from "react-icons/io5";
import { Header } from "../components/Header";
import type { Mission } from "../types";

export const EarnPage: React.FC = () => {
  const [missions, setMissions] = useState<Mission[]>([
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
    {
      id: 4,
      title: "Complete Profile",
      reward: 75,
      completed: false,
      description: "Fill out your profile information",
    },
  ]);

  const [balance, setBalance] = useState(500);

  const claimReward = (id: number) => {
    setMissions(
      missions.map((m) => (m.id === id ? { ...m, completed: true } : m))
    );
    const mission = missions.find((m) => m.id === id);
    if (mission) setBalance(balance + mission.reward);
  };

  return (
    <div className="pb-20 bg-[#000000] min-h-screen">
      <Header
        title="Earn"
        balance={balance}
      />

      {/* Balance Card */}
      <div className="p-4">
        <div className="bg-gradient-to-br from-[#0A84FF] to-[#0051D5] rounded-2xl p-6 text-white">
          <div className="flex items-center gap-2 text-sm opacity-90 mb-2">
            <IoWalletSharp size={16} />
            Total Balance
          </div>
          <div className="text-4xl font-bold mb-4">{balance} DOGG</div>
          <div className="flex gap-3">
            <button className="flex-1 bg-white/20 backdrop-blur py-3 rounded-xl font-semibold flex items-center justify-center gap-2">
              <IoTrendingUpSharp size={18} />
              Withdraw
            </button>
            <button className="flex-1 bg-white text-[#0A84FF] py-3 rounded-xl font-semibold flex items-center justify-center gap-2">
              <IoAddSharp size={18} />
              Buy More
            </button>
          </div>
        </div>
      </div>

      {/* Missions */}
      <div className="px-4 mb-6">
        <h3 className="text-lg font-semibold text-white mb-3">Missions</h3>
        <div className="space-y-2">
          {missions.map((mission) => (
            <div
              key={mission.id}
              className="bg-[#1c1c1e] border border-gray-800 rounded-2xl p-4"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="font-semibold text-white mb-1">
                    {mission.title}
                  </div>
                  <div className="text-sm text-gray-400">
                    {mission.description}
                  </div>
                </div>
                {mission.completed && (
                  <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                    <IoCheckmark
                      size={16}
                      className="text-green-400"
                    />
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-2">
                  <IoGiftSharp
                    size={16}
                    className="text-[#0A84FF]"
                  />
                  <span className="font-bold text-[#0A84FF]">
                    {mission.reward} DOGG
                  </span>
                </div>
                <button
                  onClick={() => claimReward(mission.id)}
                  disabled={mission.completed}
                  className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
                    mission.completed
                      ? "bg-[#2c2c2e] text-gray-500 cursor-not-allowed border border-gray-800"
                      : "bg-[#0A84FF] text-white active:scale-95"
                  }`}
                >
                  {mission.completed ? "Claimed" : "Claim"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Referral */}
      <div className="px-4">
        <div className="bg-[#1c1c1e] border border-gray-800 rounded-2xl p-6">
          <div className="text-center mb-4">
            <div className="w-16 h-16 bg-pink-500/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <IoPeopleSharp
                size={32}
                className="text-pink-400"
              />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Invite Friends
            </h3>
            <p className="text-sm text-gray-400">
              Earn 7% of your friends' transactions
            </p>
          </div>

          <div className="bg-[#000000] rounded-xl p-4 mb-4 border border-gray-800">
            <div className="w-24 h-24 bg-[#1c1c1e] rounded-xl mx-auto flex items-center justify-center border border-gray-800">
              <IoShareSocialSharp
                size={40}
                className="text-gray-600"
              />
            </div>
          </div>

          <button className="w-full bg-[#0A84FF] text-white py-4 rounded-xl font-semibold active:scale-[0.98] transition-transform flex items-center justify-center gap-2">
            <IoShareSocialSharp size={20} />
            Share Invite Link
          </button>

          <div className="mt-4 grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="text-xl font-bold text-white">12</div>
              <div className="text-xs text-gray-400">Friends</div>
            </div>
            <div>
              <div className="text-xl font-bold text-white">350</div>
              <div className="text-xs text-gray-400">Earned</div>
            </div>
            <div>
              <div className="text-xl font-bold text-white">7%</div>
              <div className="text-xs text-gray-400">Bonus</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
