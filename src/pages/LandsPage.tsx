import React, { useState, useEffect } from "react";
import {
  IoMapSharp,
  IoWalletSharp,
  IoPeopleSharp,
  IoStarSharp,
  IoFlameSharp,
  IoGiftSharp,
  IoTrendingUpSharp,
} from "react-icons/io5";
import { Header } from "../components/Header";
import { Modal } from "../components/Modal";
import { SectionHeader } from "../components/SectionHeader";
import type { Land } from "../types";

interface NFT {
  id: number;
  name: string;
  price: number;
  icon: React.ComponentType<{ size: number; className?: string }>;
  gradient: string;
}

type ModalType = "land" | "nft" | null;

export const LandsPage: React.FC = () => {
  const [lands, setLands] = useState<Land[]>([]);
  const [selectedLand, setSelectedLand] = useState<Land | null>(null);
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
  const [filter, setFilter] = useState("all");
  const [modalType, setModalType] = useState<ModalType>(null);

  const nfts: NFT[] = [
    {
      id: 1,
      name: "Star Dog",
      price: 100,
      icon: IoStarSharp,
      gradient: "from-purple-500 to-blue-500",
    },
    {
      id: 2,
      name: "Fire Dog",
      price: 150,
      icon: IoFlameSharp,
      gradient: "from-orange-500 to-red-500",
    },
    {
      id: 3,
      name: "Gift Dog",
      price: 200,
      icon: IoGiftSharp,
      gradient: "from-green-500 to-emerald-500",
    },
    {
      id: 4,
      name: "Trending Dog",
      price: 250,
      icon: IoTrendingUpSharp,
      gradient: "from-cyan-500 to-blue-600",
    },
  ];

  useEffect(() => {
    const generatedLands: Land[] = [];
    for (let i = 0; i < 100; i++) {
      generatedLands.push({
        id: i + 1,
        price: Math.floor(Math.random() * 900) + 100,
        status:
          Math.random() > 0.7
            ? "sold"
            : Math.random() > 0.5
            ? "special"
            : "available",
        type: ["TONVERSE", "Notverse", "Xverse"][Math.floor(Math.random() * 3)],
      });
    }
    setLands(generatedLands);
  }, []);

  const getColor = (status: string) => {
    if (status === "available") return "#4CAF50";
    if (status === "special") return "#0A84FF";
    return "#FF453A";
  };

  const filteredLands = lands.filter(
    (land) => filter === "all" || land.type === filter
  );

  const handleLandClick = (land: Land) => {
    setSelectedLand(land);
    setModalType("land");
  };

  const handleNFTClick = (nft: NFT) => {
    setSelectedNFT(nft);
    setModalType("nft");
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedLand(null);
    setSelectedNFT(null);
  };

  const getModalTitle = () => {
    if (modalType === "land") return "Land Purchase";
    if (modalType === "nft") return "NFT Purchase";
    return "";
  };

  return (
    <div
      className="pb-20 min-h-screen bg-[#000000]"
      style={{ paddingBottom: "calc(80px + var(--tg-safe-area-inset-bottom))" }}
    >
      <Header
        title="Land Marketplace"
        balance={500}
      />

      {/* Filters */}
      <div className="sticky top-14 bg-[#000000] border-b border-gray-800 z-30">
        <div className="px-4 py-3 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {["all", "TONVERSE", "Notverse", "Xverse"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filter === f
                    ? "bg-[#0A84FF] text-white"
                    : "bg-[#1c1c1e] text-gray-400 border border-gray-800"
                }`}
              >
                {f === "all" ? "All Lands" : f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Land Grid */}
      <div className="p-4">
        <div className="bg-[#1c1c1e] rounded-2xl border border-gray-800 p-3">
          <div className="grid grid-cols-10 gap-1">
            {filteredLands.map((land) => (
              <button
                key={land.id}
                className="aspect-square rounded transition-transform active:scale-95"
                style={{ backgroundColor: getColor(land.status) }}
                onClick={() => handleLandClick(land)}
              />
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-1.5">
            <div
              className="w-3 h-3 rounded"
              style={{ backgroundColor: "#4CAF50" }}
            />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div
              className="w-3 h-3 rounded"
              style={{ backgroundColor: "#0A84FF" }}
            />
            <span>Special</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div
              className="w-3 h-3 rounded"
              style={{ backgroundColor: "#FF453A" }}
            />
            <span>Sold</span>
          </div>
        </div>
      </div>

      <Modal
        isOpen={modalType !== null}
        onClose={closeModal}
        title={getModalTitle()}
      >
        {modalType === "land" && selectedLand && (
          <>
            <div className="w-16 h-16 bg-[#0A84FF]/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <IoMapSharp
                size={32}
                className="text-[#0A84FF]"
              />
            </div>

            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-1">
                Land #{selectedLand.id}
              </h3>
              <div className="text-sm text-gray-400">{selectedLand.type}</div>
            </div>

            <div className="bg-[#000000] rounded-2xl p-4 mb-6 border border-gray-800">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-gray-400">Status</span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    selectedLand.status === "available"
                      ? "bg-green-500/20 text-green-400"
                      : selectedLand.status === "special"
                      ? "bg-blue-500/20 text-blue-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {selectedLand.status === "available"
                    ? "Available"
                    : selectedLand.status === "special"
                    ? "Special"
                    : "Sold"}
                </span>
              </div>
              <div className="text-center pt-3 border-t border-gray-800">
                <div className="text-sm text-gray-400 mb-1">Price</div>
                <div className="text-3xl font-bold text-[#0A84FF]">
                  {selectedLand.price} DOGG
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                disabled={selectedLand.status === "sold"}
                className={`w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                  selectedLand.status === "sold"
                    ? "bg-[#2c2c2e] text-gray-500 cursor-not-allowed border border-gray-800"
                    : "bg-[#0A84FF] text-white active:scale-[0.98]"
                }`}
              >
                <IoWalletSharp size={20} />
                {selectedLand.status === "sold" ? "Sold Out" : "Buy Now"}
              </button>

              {selectedLand.status !== "sold" && (
                <button className="w-full bg-[#2c2c2e] text-white py-4 rounded-xl font-semibold active:scale-[0.98] transition-transform flex items-center justify-center gap-2 border border-gray-800">
                  <IoPeopleSharp size={20} />
                  Shared Buy
                </button>
              )}
            </div>
          </>
        )}

        {modalType === "nft" && selectedNFT && (
          <>
            <div
              className={`w-24 h-24 bg-gradient-to-br ${selectedNFT.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6`}
            >
              <selectedNFT.icon
                size={48}
                className="text-white"
              />
            </div>

            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-1">
                {selectedNFT.name}
              </h3>
              <div className="text-sm text-gray-400">NFT #{selectedNFT.id}</div>
            </div>

            <div className="bg-[#000000] rounded-2xl p-4 mb-6 border border-gray-800">
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Rarity</span>
                  <span className="text-white font-semibold">
                    {selectedNFT.id === 1
                      ? "Common"
                      : selectedNFT.id === 2
                      ? "Rare"
                      : selectedNFT.id === 3
                      ? "Epic"
                      : "Legendary"}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Type</span>
                  <span className="text-white font-semibold">Collectible</span>
                </div>
              </div>
              <div className="text-center pt-4 mt-4 border-t border-gray-800">
                <div className="text-sm text-gray-400 mb-1">Price</div>
                <div className="text-3xl font-bold text-[#0A84FF]">
                  {selectedNFT.price} DOGG
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button className="w-full bg-[#0A84FF] text-white py-4 rounded-xl font-semibold active:scale-[0.98] transition-transform flex items-center justify-center gap-2">
                <IoWalletSharp size={20} />
                Buy NFT
              </button>
              <button className="w-full bg-[#2c2c2e] text-white py-4 rounded-xl font-semibold active:scale-[0.98] transition-transform flex items-center justify-center gap-2 border border-gray-800">
                <IoPeopleSharp size={20} />
                Shared Buy
              </button>
            </div>
          </>
        )}
      </Modal>

      {/* NFT Section */}
      <div className="px-4 mt-6">
        <SectionHeader
          title="Featured NFTs"
          actionText="View All"
        />

        <div className="grid grid-cols-2 gap-3">
          {nfts.map((nft) => {
            const Icon = nft.icon;
            return (
              <button
                key={nft.id}
                onClick={() => handleNFTClick(nft)}
                className="bg-[#1c1c1e] border border-gray-800 rounded-2xl overflow-hidden active:scale-[0.98] transition-transform text-left"
              >
                <div
                  className={`aspect-square bg-gradient-to-br ${nft.gradient} flex items-center justify-center`}
                >
                  <Icon
                    size={64}
                    className="text-white"
                  />
                </div>
                <div className="p-3">
                  <div className="font-semibold text-white text-sm mb-1">
                    {nft.name}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#0A84FF] font-bold text-sm">
                      {nft.price} DOGG
                    </span>
                    <span className="text-[#0A84FF] text-xs font-medium bg-[#0A84FF]/10 px-3 py-1 rounded-full">
                      View
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
