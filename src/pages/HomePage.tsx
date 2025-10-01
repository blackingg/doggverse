import React from "react";
import {
  IoMapSharp,
  IoChevronForward,
  IoGiftSharp,
  IoPeopleSharp,
  IoGlobeSharp,
  IoStarSharp,
  IoFlameSharp,
} from "react-icons/io5";
import { Header } from "../components/Header";

export const HomePage: React.FC<{ onNavigate: (tab: string) => void }> = ({
  onNavigate,
}) => {
  return (
    <div className="pb-20 bg-[#000000] min-h-screen">
      <Header
        title="Dogglands"
        balance={500}
      />

      {/* Hero Card */}
      <div className="p-4">
        <div className="bg-gradient-to-br from-[#0A84FF] to-[#0051D5] rounded-2xl p-6 text-white">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-3">
            <IoMapSharp size={28} />
          </div>
          <h2 className="text-2xl font-bold mb-2">Welcome to Dogglands</h2>
          <p className="text-white/90 mb-4">
            Trade virtual lands on TON blockchain
          </p>
          <button
            onClick={() => onNavigate("lands")}
            className="bg-white text-[#0A84FF] px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2"
          >
            Explore Lands
            <IoChevronForward size={18} />
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="px-4 mb-6">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-[#1c1c1e] rounded-xl p-4 text-center border border-gray-800">
            <div className="text-2xl font-bold text-white">500</div>
            <div className="text-xs text-gray-400 mt-1">Total Lands</div>
          </div>
          <div className="bg-[#1c1c1e] rounded-xl p-4 text-center border border-gray-800">
            <div className="text-2xl font-bold text-white">2.4K</div>
            <div className="text-xs text-gray-400 mt-1">Users</div>
          </div>
          <div className="bg-[#1c1c1e] rounded-xl p-4 text-center border border-gray-800">
            <div className="text-2xl font-bold text-white">15K</div>
            <div className="text-xs text-gray-400 mt-1">Volume</div>
          </div>
        </div>
      </div>

      {/* Featured Collections */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-white">Collections</h3>
          <button className="text-[#0A84FF] text-sm font-medium">
            View All
          </button>
        </div>
        <div className="space-y-2">
          {["TONVERSE", "Notverse", "Xverse"].map((name, i) => (
            <div
              key={name}
              className="bg-[#1c1c1e] border border-gray-800 rounded-xl p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    i === 0
                      ? "bg-blue-500/20"
                      : i === 1
                      ? "bg-purple-500/20"
                      : "bg-green-500/20"
                  }`}
                >
                  {i === 0 ? (
                    <IoGlobeSharp
                      size={24}
                      className="text-blue-400"
                    />
                  ) : i === 1 ? (
                    <IoStarSharp
                      size={24}
                      className="text-purple-400"
                    />
                  ) : (
                    <IoFlameSharp
                      size={24}
                      className="text-green-400"
                    />
                  )}
                </div>
                <div>
                  <div className="font-semibold text-white">{name}</div>
                  <div className="text-sm text-gray-400">
                    {100 + i * 50} plots
                  </div>
                </div>
              </div>
              <IoChevronForward
                size={20}
                className="text-gray-600"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4">
        <h3 className="text-lg font-semibold text-white mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onNavigate("earn")}
            className="bg-[#1c1c1e] border border-gray-800 rounded-xl p-4 text-left"
          >
            <div className="w-10 h-10 bg-yellow-500/20 rounded-xl flex items-center justify-center mb-3">
              <IoGiftSharp
                size={24}
                className="text-yellow-400"
              />
            </div>
            <div className="font-semibold text-white">Earn Rewards</div>
            <div className="text-xs text-gray-400 mt-1">Complete missions</div>
          </button>
          <button className="bg-[#1c1c1e] border border-gray-800 rounded-xl p-4 text-left">
            <div className="w-10 h-10 bg-pink-500/20 rounded-xl flex items-center justify-center mb-3">
              <IoPeopleSharp
                size={24}
                className="text-pink-400"
              />
            </div>
            <div className="font-semibold text-white">Invite Friends</div>
            <div className="text-xs text-gray-400 mt-1">Earn 7% bonus</div>
          </button>
        </div>
      </div>
    </div>
  );
};
