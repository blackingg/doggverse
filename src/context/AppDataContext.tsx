import React, { createContext, useContext, useState, useEffect } from "react";
import type { LandData } from "../types";

export interface WalletData {
  address: string;
  balance: number;
  assets: {
    DOGG: number;
    lands: string[];
    nfts: number[];
  };
}

export interface Transaction {
  id: string;
  type: "buy_land" | "sell_land" | "buy_nft" | "transfer" | "receive";
  amount: number;
  timestamp: number;
  description: string;
  status: "pending" | "completed" | "failed";
}

export interface Notification {
  id: string;
  type: "success" | "error" | "info" | "warning";
  message: string;
  timestamp: number;
  read: boolean;
}

export interface Island {
  name: string;
  offsetX: number;
  offsetZ: number;
  colors: number[];
  platformColor: number;
  totalPlots: number;
  availablePlots: number;
  soldPlots: number;
}

interface AppDataContextType {
  wallet: WalletData;
  updateBalance: (amount: number) => void;
  addTransaction: (transaction: Omit<Transaction, "id" | "timestamp">) => void;
  transactions: Transaction[];

  islands: Island[];
  lands: LandData[];
  soldLands: Set<string>;
  markLandAsSold: (landId: string) => void;
  purchaseLand: (landId: string, price: number) => Promise<boolean>;

  notifications: Notification[];
  addNotification: (
    notification: Omit<Notification, "id" | "timestamp" | "read">
  ) => void;
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;

  stats: {
    totalLands: number;
    ownedLands: number;
    totalValue: number;
  };
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

export const useAppData = () => {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error("useAppData must be used within AppDataProvider");
  }
  return context;
};

export const AppDataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [wallet, setWallet] = useState<WalletData>({
    address: "DOGG" + Math.random().toString(36).substring(2, 15).toUpperCase(),
    balance: 5000,
    assets: {
      DOGG: 5000,
      lands: [],
      nfts: [],
    },
  });

  const [islands] = useState<Island[]>([
    {
      name: "TONVERSE",
      offsetX: -700,
      offsetZ: 0,
      colors: [0x3b82f6, 0x0a84ff, 0x06b6d4, 0x2563eb, 0x1d4ed8],
      platformColor: 0x1e40af,
      totalPlots: 25,
      availablePlots: 20,
      soldPlots: 5,
    },
    {
      name: "Notverse",
      offsetX: 0,
      offsetZ: 0,
      colors: [0x10b981, 0x059669, 0x84cc16, 0x22c55e, 0x16a34a],
      platformColor: 0x065f46,
      totalPlots: 25,
      availablePlots: 20,
      soldPlots: 5,
    },
    {
      name: "Xverse",
      offsetX: 700,
      offsetZ: 0,
      colors: [0x8b5cf6, 0xa855f7, 0xf59e0b, 0xd946ef, 0xc026d3],
      platformColor: 0x7e22ce,
      totalPlots: 25,
      availablePlots: 20,
      soldPlots: 5,
    },
  ]);

  const [lands, setLands] = useState<LandData[]>([]);
  const [soldLands, setSoldLands] = useState<Set<string>>(new Set());

  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const generatedLands: LandData[] = [];
    const islandSize = 5;
    let landCounter = 0;

    islands.forEach((island) => {
      for (let i = 0; i < islandSize; i++) {
        for (let j = 0; j < islandSize; j++) {
          const colorIndex = (i + j) % island.colors.length;
          const baseColor = island.colors[colorIndex];
          const isOwned = Math.random() < 0.2;
          const landId = `${island.name
            .slice(0, 3)
            .toUpperCase()}-${String.fromCharCode(65 + i)}${j + 1}`;

          generatedLands.push({
            gridX: i,
            gridY: j,
            island: island.name,
            id: landId,
            price: Math.floor(Math.random() * 2000) + 500,
            type: ["Premium", "Standard", "Luxury"][
              Math.floor(Math.random() * 3)
            ],
            owned: isOwned,
            originalColor: baseColor,
            originalEmissive: 0x111111,
          });

          if (isOwned) {
            setSoldLands((prev) => new Set(prev).add(landId));
          }

          landCounter++;
        }
      }
    });

    setLands(generatedLands);
  }, [islands]);

  const updateBalance = (amount: number) => {
    setWallet((prev) => ({
      ...prev,
      balance: prev.balance + amount,
      assets: {
        ...prev.assets,
        DOGG: prev.assets.DOGG + amount,
      },
    }));
  };

  const addTransaction = (
    transaction: Omit<Transaction, "id" | "timestamp">
  ) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
    };
    setTransactions((prev) => [newTransaction, ...prev]);
  };

  const markLandAsSold = (landId: string) => {
    setSoldLands((prev) => new Set(prev).add(landId));
    setLands((prev) =>
      prev.map((land) => (land.id === landId ? { ...land, owned: true } : land))
    );
  };

  const purchaseLand = async (
    landId: string,
    price: number
  ): Promise<boolean> => {
    if (wallet.balance < price) {
      addNotification({
        type: "error",
        message: "Insufficient balance to purchase this land",
      });
      return false;
    }

    // Simulate async transaction
    return new Promise((resolve) => {
      setTimeout(() => {
        // Deduct balance
        updateBalance(-price);

        // Mark land as sold
        markLandAsSold(landId);

        // Add to user's assets
        setWallet((prev) => ({
          ...prev,
          assets: {
            ...prev.assets,
            lands: [...prev.assets.lands, landId],
          },
        }));

        // Add transaction
        addTransaction({
          type: "buy_land",
          amount: -price,
          description: `Purchased land ${landId}`,
          status: "completed",
        });

        // Add success notification
        addNotification({
          type: "success",
          message: `Successfully purchased ${landId} for ${price} DOGG!`,
        });

        resolve(true);
      }, 500);
    });
  };

  const addNotification = (
    notification: Omit<Notification, "id" | "timestamp" | "read">
  ) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
      read: false,
    };
    setNotifications((prev) => [newNotification, ...prev].slice(0, 50));
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const stats = {
    totalLands: lands.length,
    ownedLands: wallet.assets.lands.length,
    totalValue: wallet.assets.lands.reduce((sum, landId) => {
      const land = lands.find((l) => l.id === landId);
      return sum + (land?.price || 0);
    }, 0),
  };

  const value: AppDataContextType = {
    wallet,
    updateBalance,
    addTransaction,
    transactions,
    islands,
    lands,
    soldLands,
    markLandAsSold,
    purchaseLand,
    notifications,
    addNotification,
    markNotificationAsRead,
    clearNotifications,
    stats,
  };

  return (
    <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
  );
};
