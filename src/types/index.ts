// Types
export interface Land {
  id: number;
  price: number;
  status: "available" | "sold" | "special";
  type: string;
}

export interface Mission {
  id: number;
  title: string;
  reward: number;
  completed: boolean;
  description: string;
}

export interface NFT {
  id: number;
  name: string;
  price: number;
  rarity: string;
}

export interface LandData {
  id: string;
  gridX: number;
  gridY: number;
  price: number;
  type: string;
  owned: boolean;
}
