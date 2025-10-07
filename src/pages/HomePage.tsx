import React, { useState, useEffect } from "react";
import {
  IoChevronForward,
  IoGiftSharp,
  IoPeopleSharp,
  IoGlobeSharp,
  IoStarSharp,
  IoFlameSharp,
  IoPlayCircle,
  IoWaterSharp,
  IoTrendingUpSharp,
  IoBuildSharp,
  IoRocketSharp,
} from "react-icons/io5";
import { Header } from "../components/Header";
import { ActionCard } from "../components/ActionCard";
import { StatCard } from "../components/StatCard";
import { SectionHeader } from "../components/SectionHeader";
import { Modal } from "../components/Modal";

export const HomePage: React.FC<{ onNavigate: (tab: string) => void }> = ({
  onNavigate,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeLevel, setUpgradeLevel] = useState(0);

  const slides = [
    {
      title: "AI Dog Breeding",
      description: "Create unique digital companions",
      icon: IoPeopleSharp,
      gradient: "from-pink-500 to-purple-500",
      image: "/images/slide1.jpg",
    },
    {
      title: "Build Your World",
      description: "Design and construct your dream land",
      icon: IoBuildSharp,
      gradient: "from-blue-500 to-cyan-500",
      image: "/images/slide2.jpg",
    },
    {
      title: "DOGG Economy",
      description: "Earn, trade, and grow your wealth",
      icon: IoTrendingUpSharp,
      gradient: "from-green-500 to-emerald-500",
      image: "/images/slide3.jpg",
    },
    {
      title: "Underwater Adventures",
      description: "Dive into oceans for rare rewards",
      icon: IoWaterSharp,
      gradient: "from-cyan-500 to-blue-600",
      image: "/images/slide4.jpg",
    },
  ];

  const stats = [
    { label: "Users", value: "100K+" },
    { label: "Lands", value: "50K+" },
    { label: "Events", value: "10+" },
  ];

  const quickActions = [
    {
      icon: IoTrendingUpSharp,
      iconBg: "bg-[#0A84FF]/20",
      iconColor: "text-[#0A84FF]",
      title: "Upgrade",
      onClick: () => setShowUpgradeModal(true),
    },
    {
      icon: IoBuildSharp,
      iconBg: "bg-green-500/20",
      iconColor: "text-green-400",
      title: "Build",
      onClick: () => onNavigate("doggverse"),
    },
    {
      icon: IoGlobeSharp,
      iconBg: "bg-purple-500/20",
      iconColor: "text-purple-400",
      title: "Explore",
      onClick: () => onNavigate("doggverse"),
    },
  ];

  const collections = [
    {
      name: "TONVERSE",
      icon: IoGlobeSharp,
      color: "bg-blue-500/20",
      textColor: "text-blue-400",
      plots: 100,
    },
    {
      name: "Notverse",
      icon: IoStarSharp,
      color: "bg-purple-500/20",
      textColor: "text-purple-400",
      plots: 150,
    },
    {
      name: "Xverse",
      icon: IoFlameSharp,
      color: "bg-green-500/20",
      textColor: "text-green-400",
      plots: 200,
    },
  ];

  const earnInviteCards = [
    {
      icon: IoGiftSharp,
      iconBg: "bg-yellow-500/20",
      iconColor: "text-yellow-400",
      title: "Earn Rewards",
      subtitle: "Complete missions",
      onClick: () => onNavigate("earn"),
    },
    {
      icon: IoPeopleSharp,
      iconBg: "bg-pink-500/20",
      iconColor: "text-pink-400",
      title: "Invite Friends",
      subtitle: "Earn 7% bonus",
      onClick: () => {},
    },
  ];

  const upgradeLevels = ["Basic", "Ocean Layer", "Premium"];
  const upgradeCost = [100, 250, 500];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="pb-20 bg-[#000000] min-h-screen">
      <Header
        title="DoggEarth"
        balance={1200}
      />

      {/* Hero Section */}
      <div className="p-4">
        <div className="relative rounded-2xl p-6 text-white overflow-hidden">
          <img
            src="/images/hero-bg.jpg"
            alt="Hero Background"
            className="absolute inset-0 w-full h-full object-cover opacity-30"
          />
          <div className="relative z-10">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
              <IoRocketSharp size={28} />
            </div>
            <h2 className="text-2xl font-bold mb-2">Welcome to DoggEarth</h2>
            <p className="text-white/90 mb-5 text-sm">
              The Dog-Powered Metaverse on TON
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => onNavigate("lands")}
                className="bg-white text-[#0A84FF] px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 text-sm active:scale-95 transition-transform"
              >
                Explore Lands
                <IoChevronForward size={16} />
              </button>
              <button className="backdrop-blur bg-[linear-gradient(to_bottom_right,rgba(10,132,255,0.5),rgba(0,81,213,0.5))] text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 text-sm active:scale-95 transition-transform">
                <IoPlayCircle size={16} />
                Watch Tour
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="px-4 mb-6">
        <div className="grid grid-cols-3 gap-3">
          {stats.map((stat) => (
            <StatCard
              key={stat.label}
              label={stat.label}
              value={stat.value}
            />
          ))}
        </div>
      </div>

      {/* Feature Slider */}
      <div className="px-4 mb-6">
        <div className="relative h-56 rounded-2xl overflow-hidden">
          {slides.map((slide, index) => {
            const Icon = slide.icon;
            return (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-700 ${
                  index === currentSlide ? "opacity-100" : "opacity-0"
                }`}
              >
                <div className="relative w-full h-full">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-50"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br opacity-70" />
                  <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white p-6">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur">
                      <Icon
                        size={32}
                        className="text-white"
                      />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{slide.title}</h3>
                    <p className="text-white/90 text-sm">{slide.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-1.5 rounded-full transition-all ${
                  index === currentSlide
                    ? "bg-white w-6"
                    : "bg-white/40 w-1.5 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 mb-6">
        <SectionHeader title="Quick Actions" />
        <div className="grid grid-cols-3 gap-3">
          {quickActions.map((action, index) => (
            <ActionCard
              key={index}
              icon={action.icon}
              iconBg={action.iconBg}
              iconColor={action.iconColor}
              title={action.title}
              onClick={action.onClick}
            />
          ))}
        </div>
      </div>

      {/* Collections */}
      <div className="px-4 mb-6">
        <SectionHeader
          title="Collections"
          actionText="View All"
        />
        <div className="space-y-2">
          {collections.map((collection) => {
            const Icon = collection.icon;
            return (
              <div
                key={collection.name}
                className="bg-[#1c1c1e] border border-gray-800 rounded-xl p-4 flex items-center justify-between active:scale-[0.98] transition-transform"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${collection.color}`}
                  >
                    <Icon
                      size={24}
                      className={collection.textColor}
                    />
                  </div>
                  <div>
                    <div className="font-semibold text-white text-sm">
                      {collection.name}
                    </div>
                    <div className="text-xs text-gray-400">
                      {collection.plots} plots
                    </div>
                  </div>
                </div>
                <IoChevronForward
                  size={20}
                  className="text-gray-600"
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Earn & Invite */}
      <div className="px-4">
        <div className="grid grid-cols-2 gap-3">
          {earnInviteCards.map((card, index) => (
            <ActionCard
              key={index}
              icon={card.icon}
              iconBg={card.iconBg}
              iconColor={card.iconColor}
              title={card.title}
              subtitle={card.subtitle}
              onClick={card.onClick}
            />
          ))}
        </div>
      </div>

      {/* Upgrade Modal */}
      <Modal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        title="Upgrade Land"
      >
        <div className="w-16 h-16 bg-[#0A84FF]/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <IoTrendingUpSharp
            size={32}
            className="text-[#0A84FF]"
          />
        </div>

        <div className="mb-6">
          <label className="text-sm text-gray-400 mb-3 block">
            Select Upgrade Level
          </label>
          <input
            type="range"
            min="0"
            max="2"
            value={upgradeLevel}
            onChange={(e) => setUpgradeLevel(Number(e.target.value))}
            className="w-full h-2 bg-[#2c2c2e] rounded-lg appearance-none cursor-pointer accent-[#0A84FF]"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            {upgradeLevels.map((level, i) => (
              <span
                key={i}
                className={`transition-colors ${
                  upgradeLevel === i ? "text-[#0A84FF] font-semibold" : ""
                }`}
              >
                {level}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-[#000000] rounded-2xl p-4 mb-6 border border-gray-800">
          <div className="text-center">
            <div className="text-sm text-gray-400 mb-1">Upgrade Cost</div>
            <div className="text-3xl font-bold text-[#0A84FF]">
              {upgradeCost[upgradeLevel]} $DOGG
            </div>
          </div>
        </div>

        <button className="w-full bg-[#0A84FF] text-white py-4 rounded-xl font-semibold active:scale-[0.98] transition-transform">
          Confirm Upgrade
        </button>
      </Modal>
    </div>
  );
};
