import React, { useState, useEffect } from "react";
import {
  IoMapSharp,
  IoClose,
  IoWalletSharp,
  IoPeopleSharp,
  IoStarSharp,
  IoFlameSharp,
  IoGiftSharp,
  IoTrendingUpSharp,
} from "react-icons/io5";
import { Header } from "../components/Header";
import type { Land } from "../types";

export const LandsPage: React.FC = () => {
  const [lands, setLands] = useState<Land[]>([]);
  const [selectedLand, setSelectedLand] = useState<Land | null>(null);
  const [filter, setFilter] = useState("all");
  const [showBuyModal, setShowBuyModal] = useState(false);

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

  return (
    <div className="pb-20 bg-[#000000] min-h-screen">
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
                onClick={() => {
                  setSelectedLand(land);
                  setShowBuyModal(true);
                }}
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

      {/* Buy Modal */}
      {showBuyModal && selectedLand && (
        <div className="fixed inset-0 bg-black/70 flex items-end justify-center z-50 p-0">
          <div className="bg-[#1c1c1e] rounded-t-3xl w-full max-w-lg animate-[slideUp_0.3s_ease-out] border-t border-gray-800">
            <div className="p-6">
              <div className="w-12 h-1 bg-gray-700 rounded-full mx-auto mb-6" />

              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-[#0A84FF]/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <IoMapSharp
                    size={32}
                    className="text-[#0A84FF]"
                  />
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">
                  Land #{selectedLand.id}
                </h3>
                <div className="text-sm text-gray-400">{selectedLand.type}</div>
              </div>

              <div className="bg-[#000000] rounded-2xl p-4 mb-6 border border-gray-800">
                <div className="text-center">
                  <div className="text-sm text-gray-400 mb-1">Price</div>
                  <div className="text-3xl font-bold text-[#0A84FF]">
                    {selectedLand.price} DOGG
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button className="w-full bg-[#0A84FF] text-white py-4 rounded-xl font-semibold active:scale-[0.98] transition-transform flex items-center justify-center gap-2">
                  <IoWalletSharp size={20} />
                  Buy Now
                </button>
                <button className="w-full bg-[#2c2c2e] text-white py-4 rounded-xl font-semibold active:scale-[0.98] transition-transform flex items-center justify-center gap-2 border border-gray-800">
                  <IoPeopleSharp size={20} />
                  Shared Buy
                </button>
                <button
                  onClick={() => setShowBuyModal(false)}
                  className="w-full py-4 text-gray-400 font-medium flex items-center justify-center gap-2"
                >
                  <IoClose size={20} />
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NFT Section */}
      <div className="px-4 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-white">Featured NFTs</h3>
          <button className="text-[#0A84FF] text-sm font-medium">
            View All
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-[#1c1c1e] border border-gray-800 rounded-2xl overflow-hidden"
            >
              <div className="aspect-square bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                {i === 0 ? (
                  <IoStarSharp
                    size={64}
                    className="text-white"
                  />
                ) : i === 1 ? (
                  <IoFlameSharp
                    size={64}
                    className="text-white"
                  />
                ) : i === 2 ? (
                  <IoGiftSharp
                    size={64}
                    className="text-white"
                  />
                ) : (
                  <IoTrendingUpSharp
                    size={64}
                    className="text-white"
                  />
                )}
              </div>
              <div className="p-3">
                <div className="font-semibold text-white text-sm mb-1">
                  NFT #{i + 1}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#0A84FF] font-bold text-sm">
                    {100 + i * 50} DOGG
                  </span>
                  <button className="text-[#0A84FF] text-xs font-medium">
                    Buy
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
