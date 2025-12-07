import React, { useState } from "react";
import {
  IoWalletSharp,
  IoCartSharp,
  IoGridSharp,
  IoTrendingUpSharp,
  IoSwapHorizontalSharp,
  IoSendSharp,
  IoDownloadSharp,
  IoStarSharp,
  IoFlameSharp,
  IoWaterSharp,
  IoSparklesSharp,
  IoCubeSharp,
  IoShieldSharp,
  IoRocketSharp,
  IoCheckmarkCircle,
  IoTimeSharp,
} from "react-icons/io5";
import { Modal } from "../components/Modal";
import { Header } from "../components/Header";
import { SectionHeader } from "../components/SectionHeader";
import { StatCard } from "../components/StatCard";
import { useAppData } from "../context/AppDataContext";

interface ShopItem {
  id: number;
  name: string;
  price: number;
  type: "power-up" | "cosmetic" | "resource" | "special";
  icon: React.ComponentType<{ size: number; className?: string }>;
  gradient: string;
  description: string;
}

interface NFTItem {
  id: number;
  name: string;
  rarity: "Common" | "Rare" | "Epic" | "Legendary";
  type: string;
  owned: boolean;
  image?: string;
}

interface Transaction {
  id: number;
  type: "buy" | "sell" | "earn" | "send" | "receive";
  amount: number;
  description: string;
  date: string;
  status: "completed" | "pending";
}

export const DashboardPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<
    "wallet" | "shop" | "gallery"
  >("wallet");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<
    "send" | "receive" | "buy" | "nft" | null
  >(null);
  const [selectedItem, setSelectedItem] = useState<ShopItem | NFTItem | null>(
    null
  );
  const [sendAmount, setSendAmount] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");

  const { wallet } = useAppData();

  const tonBalance = 5.43;

  const shopItems: ShopItem[] = [
    {
      id: 1,
      name: "Speed Boost",
      price: 50,
      type: "power-up",
      icon: IoRocketSharp,
      gradient: "from-blue-500 to-cyan-500",
      description: "Increase movement speed by 50% for 1 hour",
    },
    {
      id: 2,
      name: "Fire Aura",
      price: 150,
      type: "cosmetic",
      icon: IoFlameSharp,
      gradient: "from-orange-500 to-red-500",
      description: "Epic flame effect for your character",
    },
    {
      id: 3,
      name: "Water Crystal",
      price: 100,
      type: "resource",
      icon: IoWaterSharp,
      gradient: "from-cyan-500 to-blue-600",
      description: "Rare resource for underwater building",
    },
    {
      id: 4,
      name: "Star Shield",
      price: 200,
      type: "special",
      icon: IoShieldSharp,
      gradient: "from-purple-500 to-pink-500",
      description: "Legendary protective shield",
    },
    {
      id: 5,
      name: "Golden Pickaxe",
      price: 120,
      type: "resource",
      icon: IoCubeSharp,
      gradient: "from-yellow-500 to-orange-500",
      description: "Increased mining efficiency",
    },
    {
      id: 6,
      name: "Sparkle Trail",
      price: 80,
      type: "cosmetic",
      icon: IoSparklesSharp,
      gradient: "from-pink-500 to-purple-500",
      description: "Leave a magical sparkle trail",
    },
  ];

  const nftCollection: NFTItem[] = [
    {
      id: 1,
      name: "Genesis Dog #001",
      rarity: "Legendary",
      type: "Character",
      owned: true,
    },
    {
      id: 2,
      name: "Ocean Land Plot",
      rarity: "Epic",
      type: "Land",
      owned: true,
    },
    {
      id: 3,
      name: "Fire Dog #142",
      rarity: "Rare",
      type: "Character",
      owned: true,
    },
    {
      id: 4,
      name: "Sky Castle",
      rarity: "Epic",
      type: "Building",
      owned: false,
    },
    {
      id: 5,
      name: "Water Dog #089",
      rarity: "Common",
      type: "Character",
      owned: true,
    },
    {
      id: 6,
      name: "Golden Throne",
      rarity: "Legendary",
      type: "Furniture",
      owned: false,
    },
  ];

  const transactions: Transaction[] = [
    {
      id: 1,
      type: "earn",
      amount: 50,
      description: "Daily Login Reward",
      date: "2 hours ago",
      status: "completed",
    },
    {
      id: 2,
      type: "buy",
      amount: -100,
      description: "Land Plot #A7",
      date: "5 hours ago",
      status: "completed",
    },
    {
      id: 3,
      type: "receive",
      amount: 250,
      description: "From @user123",
      date: "1 day ago",
      status: "completed",
    },
    {
      id: 4,
      type: "sell",
      amount: 300,
      description: "NFT Sale #Fire Dog",
      date: "2 days ago",
      status: "completed",
    },
    {
      id: 5,
      type: "send",
      amount: -75,
      description: "To @friend456",
      date: "3 days ago",
      status: "pending",
    },
  ];

  const handleBuyItem = (item: ShopItem) => {
    setSelectedItem(item);
    setModalType("buy");
    setShowModal(true);
  };

  const handleNFTClick = (nft: NFTItem) => {
    setSelectedItem(nft);
    setModalType("nft");
    setShowModal(true);
  };

  const handleSendMoney = () => {
    setModalType("send");
    setShowModal(true);
  };

  const handleReceiveMoney = () => {
    setModalType("receive");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType(null);
    setSelectedItem(null);
    setSendAmount("");
    setRecipientAddress("");
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "buy":
        return IoCartSharp;
      case "sell":
        return IoTrendingUpSharp;
      case "earn":
        return IoStarSharp;
      case "send":
        return IoSendSharp;
      case "receive":
        return IoDownloadSharp;
      default:
        return IoWalletSharp;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case "buy":
      case "send":
        return "text-red-400";
      case "sell":
      case "earn":
      case "receive":
        return "text-green-400";
      default:
        return "text-gray-400";
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "Legendary":
        return "text-yellow-400 bg-yellow-500/20";
      case "Epic":
        return "text-purple-400 bg-purple-500/20";
      case "Rare":
        return "text-blue-400 bg-blue-500/20";
      default:
        return "text-gray-400 bg-gray-500/20";
    }
  };

  return (
    <div
      className="pb-20 min-h-screen bg-[#000000]"
      style={{ paddingBottom: "calc(80px + var(--tg-safe-area-inset-bottom))" }}
    >
      <Header
        title="Dashboard"
        balance={wallet.balance}
      />

      <div className="sticky top-14 bg-[#000000] border-b border-gray-800 z-30">
        <div className="px-4 py-3">
          <div className="flex gap-2">
            {[
              { id: "wallet", label: "Wallet", icon: IoWalletSharp },
              { id: "shop", label: "Shop", icon: IoCartSharp },
              { id: "gallery", label: "Gallery", icon: IoGridSharp },
            ].map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id as any)}
                  className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                    activeSection === section.id
                      ? "bg-[#0A84FF] text-white"
                      : "bg-[#1c1c1e] text-gray-400 border border-gray-800"
                  }`}
                >
                  <Icon size={18} />
                  {section.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {activeSection === "wallet" && (
        <div className="p-4 space-y-6">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-br from-[#0A84FF] to-[#0051D5] rounded-2xl p-5 text-white">
              <div className="text-sm opacity-90 mb-1">DOGG Balance</div>
              <div className="text-3xl font-bold">{wallet.balance}</div>
              <div className="text-xs opacity-75 mt-1">$DOGG</div>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-5 text-white">
              <div className="text-sm opacity-90 mb-1">TON Balance</div>
              <div className="text-3xl font-bold">{tonBalance}</div>
              <div className="text-xs opacity-75 mt-1">TON</div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {[
              {
                icon: IoSendSharp,
                label: "Send",
                color: "bg-blue-500/20 text-blue-400",
                action: handleSendMoney,
              },
              {
                icon: IoDownloadSharp,
                label: "Receive",
                color: "bg-green-500/20 text-green-400",
                action: handleReceiveMoney,
              },
              {
                icon: IoSwapHorizontalSharp,
                label: "Swap",
                color: "bg-purple-500/20 text-purple-400",
                action: () => {},
              },
              {
                icon: IoTrendingUpSharp,
                label: "Trade",
                color: "bg-orange-500/20 text-orange-400",
                action: () => {},
              },
            ].map((action, idx) => {
              const Icon = action.icon;
              return (
                <button
                  key={idx}
                  onClick={action.action}
                  className="bg-[#1c1c1e] border border-gray-800 rounded-xl p-4 text-center active:scale-95 transition-transform"
                >
                  <div
                    className={`w-10 h-10 ${action.color} rounded-xl flex items-center justify-center mx-auto mb-2`}
                  >
                    <Icon size={20} />
                  </div>
                  <div className="text-xs font-semibold text-white">
                    {action.label}
                  </div>
                </button>
              );
            })}
          </div>

          <div>
            <SectionHeader title="Portfolio Stats" />
            <div className="grid grid-cols-3 gap-3">
              <StatCard
                label="Total Value"
                value={`$${Math.round(wallet.balance * 0.5)}`}
              />
              <StatCard
                label="NFTs Owned"
                value={`${wallet.assets.nfts.length}`}
              />
              <StatCard
                label="Lands"
                value={`${wallet.assets.lands.length}`}
              />
            </div>
          </div>

          <div>
            <SectionHeader
              title="Recent Transactions"
              actionText="View All"
            />
            <div className="space-y-2">
              {transactions.map((tx) => {
                const Icon = getTransactionIcon(tx.type);
                return (
                  <div
                    key={tx.id}
                    className="bg-[#1c1c1e] border border-gray-800 rounded-xl p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#2c2c2e] rounded-xl flex items-center justify-center">
                        <Icon
                          size={20}
                          className="text-[#0A84FF]"
                        />
                      </div>
                      <div>
                        <div className="font-semibold text-white text-sm">
                          {tx.description}
                        </div>
                        <div className="text-xs text-gray-400 flex items-center gap-2">
                          {tx.date}
                          {tx.status === "pending" && (
                            <span className="flex items-center gap-1 text-yellow-400">
                              <IoTimeSharp size={12} />
                              Pending
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div
                      className={`font-bold ${getTransactionColor(tx.type)}`}
                    >
                      {tx.amount > 0 ? "+" : ""}
                      {tx.amount} DOGG
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeSection === "shop" && (
        <div className="p-4">
          <SectionHeader
            title="Item Shop"
            actionText="Filters"
          />
          <div className="grid grid-cols-2 gap-3">
            {shopItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleBuyItem(item)}
                  className="bg-[#1c1c1e] border border-gray-800 rounded-2xl overflow-hidden active:scale-[0.98] transition-transform text-left"
                >
                  <div
                    className={`aspect-square bg-gradient-to-br ${item.gradient} flex items-center justify-center`}
                  >
                    <Icon
                      size={64}
                      className="text-white"
                    />
                  </div>
                  <div className="p-3">
                    <div className="font-semibold text-white text-sm mb-1">
                      {item.name}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#0A84FF] font-bold text-sm">
                        {item.price} DOGG
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          item.type === "power-up"
                            ? "bg-blue-500/20 text-blue-400"
                            : item.type === "cosmetic"
                            ? "bg-purple-500/20 text-purple-400"
                            : item.type === "resource"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-yellow-500/20 text-yellow-400"
                        }`}
                      >
                        {item.type
                          .split("-")
                          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                          .join(" ")}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {activeSection === "gallery" && (
        <div className="p-4">
          <SectionHeader
            title="NFT Collection"
            actionText="Sort"
          />
          <div className="grid grid-cols-2 gap-3">
            {nftCollection.map((nft) => (
              <button
                key={nft.id}
                onClick={() => handleNFTClick(nft)}
                className={`bg-[#1c1c1e] border rounded-2xl overflow-hidden text-left transition-all ${
                  nft.owned
                    ? "border-gray-800 active:scale-[0.98]"
                    : "border-gray-800 opacity-60"
                }`}
              >
                <div className="aspect-square bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center relative">
                  <IoGridSharp
                    size={64}
                    className="text-gray-600"
                  />
                  {!nft.owned && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        Not Owned
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <div className="font-semibold text-white text-sm mb-2">
                    {nft.name}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">{nft.type}</span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-semibold ${getRarityColor(
                        nft.rarity
                      )}`}
                    >
                      {nft.rarity}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={
          modalType === "send"
            ? "Send DOGG"
            : modalType === "receive"
            ? "Receive DOGG"
            : modalType === "buy"
            ? "Purchase Item"
            : modalType === "nft"
            ? "NFT Details"
            : ""
        }
      >
        {modalType === "send" && (
          <>
            <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <IoSendSharp
                size={32}
                className="text-blue-400"
              />
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">
                  Recipient Address
                </label>
                <input
                  type="text"
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  placeholder="Enter wallet address"
                  className="w-full bg-[#000000] border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-[#0A84FF] focus:outline-none"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">
                  Amount
                </label>
                <input
                  type="number"
                  value={sendAmount}
                  onChange={(e) => setSendAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-[#000000] border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-[#0A84FF] focus:outline-none"
                />
                <div className="text-xs text-gray-400 mt-2">
                  Available: {wallet.balance} DOGG
                </div>
              </div>
            </div>

            <button className="w-full bg-[#0A84FF] text-white py-4 rounded-xl font-semibold active:scale-[0.98] transition-transform">
              Send DOGG
            </button>
          </>
        )}

        {modalType === "receive" && (
          <>
            <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <IoDownloadSharp
                size={32}
                className="text-green-400"
              />
            </div>

            <div className="bg-[#000000] rounded-2xl p-6 mb-6 border border-gray-800 text-center">
              <div className="w-32 h-32 bg-white rounded-xl mx-auto mb-4 flex items-center justify-center">
                <div className="text-xs text-gray-500">QR Code</div>
              </div>
              <div className="text-sm text-gray-400 mb-2">Your Address</div>
              <div className="bg-[#1c1c1e] rounded-xl p-3 text-[#0A84FF] text-sm font-mono break-all">
                0x742d35Cc6634C0532925a3b8...
              </div>
            </div>

            <button className="w-full bg-[#0A84FF] text-white py-4 rounded-xl font-semibold active:scale-[0.98] transition-transform">
              Copy Address
            </button>
          </>
        )}

        {modalType === "buy" && selectedItem && "gradient" in selectedItem && (
          <>
            <div
              className={`w-24 h-24 bg-gradient-to-br ${
                (selectedItem as ShopItem).gradient
              } rounded-2xl flex items-center justify-center mx-auto mb-6`}
            >
              <selectedItem.icon
                size={48}
                className="text-white"
              />
            </div>

            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">
                {selectedItem.name}
              </h3>
              <p className="text-sm text-gray-400">
                {(selectedItem as ShopItem).description}
              </p>
            </div>

            <div className="bg-[#000000] rounded-2xl p-4 mb-6 border border-gray-800 text-center">
              <div className="text-sm text-gray-400 mb-1">Price</div>
              <div className="text-3xl font-bold text-[#0A84FF]">
                {selectedItem.price} DOGG
              </div>
            </div>

            <button className="w-full bg-[#0A84FF] text-white py-4 rounded-xl font-semibold active:scale-[0.98] transition-transform flex items-center justify-center gap-2">
              <IoCartSharp size={20} />
              Purchase Item
            </button>
          </>
        )}

        {modalType === "nft" && selectedItem && "rarity" in selectedItem && (
          <>
            <div className="aspect-square bg-gradient-to-br from-gray-700 to-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <IoGridSharp
                size={80}
                className="text-gray-600"
              />
            </div>

            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">
                {selectedItem.name}
              </h3>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getRarityColor(
                  (selectedItem as NFTItem).rarity
                )}`}
              >
                {(selectedItem as NFTItem).rarity}
              </span>
            </div>

            <div className="bg-[#000000] rounded-2xl p-4 mb-6 border border-gray-800 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Type</span>
                <span className="text-white font-semibold">
                  {(selectedItem as NFTItem).type}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Status</span>
                <span
                  className={`flex items-center gap-1 font-semibold ${
                    (selectedItem as NFTItem).owned
                      ? "text-green-400"
                      : "text-gray-400"
                  }`}
                >
                  {(selectedItem as NFTItem).owned ? (
                    <>
                      <IoCheckmarkCircle size={16} />
                      Owned
                    </>
                  ) : (
                    "Not Owned"
                  )}
                </span>
              </div>
            </div>

            {(selectedItem as NFTItem).owned ? (
              <div className="space-y-3">
                <button className="w-full bg-[#0A84FF] text-white py-4 rounded-xl font-semibold active:scale-[0.98] transition-transform">
                  List for Sale
                </button>
                <button className="w-full bg-[#2c2c2e] text-white py-4 rounded-xl font-semibold active:scale-[0.98] transition-transform border border-gray-800">
                  Transfer
                </button>
              </div>
            ) : (
              <button className="w-full bg-[#2c2c2e] text-gray-500 py-4 rounded-xl font-semibold cursor-not-allowed">
                Not Available
              </button>
            )}
          </>
        )}
      </Modal>
    </div>
  );
};
