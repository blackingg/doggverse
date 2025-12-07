# Centralized Data Architecture

## Overview
The application uses a centralized data management system via `AppDataContext` to ensure all data is consistent across components.

## AppDataContext (`src/context/AppDataContext.tsx`)

Central store for all application data:

### **1. Wallet & User Data**
```typescript
wallet: {
  address: string;        // Unique user identifier
  balance: number;        // Current DOGG token balance
  assets: {
    DOGG: number;        // Token count
    lands: string[];     // Array of owned land IDs
    nfts: number[];      // Array of owned NFT IDs
  }
}
```

### **2. Islands Configuration**
```typescript
islands: [
  {
    name: "TONVERSE",
    offsetX: -700,
    offsetZ: 0,
    colors: [0x3b82f6, 0x0a84ff, ...],
    platformColor: 0x1e40af,
    totalPlots: 25,
    availablePlots: 20,
    soldPlots: 5
  },
  // Notverse, Xverse...
]
```

### **3. Lands Data**
```typescript
lands: LandData[]  // 75 total plots across 3 islands

interface LandData {
  id: string;
  gridX: number;
  gridY: number;
  island: string;
  price: number;
  type: string;
  owned: boolean;
  originalColor: number;
  originalEmissive: number;
}
```

### **4. Ownership Tracking**
```typescript
soldLands: Set<string>  // Set of land IDs that are sold
```

### **5. Transactions**
```typescript
transactions: Transaction[]

interface Transaction {
  id: string;
  type: "buy_land" | "sell_land" | "buy_nft" | "transfer" | "receive";
  amount: number;
  timestamp: number;
  description: string;
  status: "pending" | "completed" | "failed";
}
```

### **6. Notifications**
```typescript
notifications: Notification[]

interface Notification {
  id: string;
  type: "success" | "error" | "info" | "warning";
  message: string;
  timestamp: number;
  read: boolean;
}
```

### **7. Statistics**
```typescript
stats: {
  totalLands: number;      // Total number of land plots
  ownedLands: number;      // User's owned lands count
  totalValue: number;      // Total value of owned lands
}
```

## Key Functions

### `updateBalance(amount: number)`
Updates wallet balance and DOGG token count.

### `purchaseLand(landId: string, price: number): Promise<boolean>`
Complete land purchase flow:
1. Validates sufficient balance
2. Deducts payment from wallet
3. Updates land ownership
4. Adds land to user's assets
5. Creates transaction record
6. Sends success notification

### `addNotification(notification)`
Adds notification to queue (max 50 retained).

### `markLandAsSold(landId: string)`
Updates land ownership status in both lands array and soldLands Set.

### `addTransaction(transaction)`
Logs transaction to history with auto-generated ID and timestamp.

## Component Integration

### **HomePage**
```typescript
const { wallet, stats, islands } = useAppData();
```
- Displays wallet balance in Header
- Shows total lands from stats
- Displays island collections with real plot counts

### **EarnPage**
```typescript
const { wallet, updateBalance } = useAppData();
```
- Displays wallet balance
- Updates balance when missions are completed
- Triggers notifications on reward claims

### **LandsPageAlt** (3D Marketplace)
```typescript
const { wallet, islands, lands, soldLands, purchaseLand } = useAppData();
```
- Displays wallet balance in Header
- Builds 3D scene from islands configuration
- Renders land cubes from lands array
- Checks soldLands Set for ownership status
- Executes purchaseLand() on buy button click

### **DashboardPage**
```typescript
const { wallet } = useAppData();
```
- Displays DOGG balance
- Shows owned lands count from wallet.assets.lands
- Shows owned NFTs count from wallet.assets.nfts
- Calculates portfolio value

### **Header Component**
Receives balance via props (passed from context in parent pages).

## Data Flow Example

**Land Purchase Flow:**
```
User taps "Buy Now" on Land #TON-A1
         ↓
purchaseLand("TON-A1", 1500)
         ↓
AppDataContext:
  - Validates: wallet.balance >= 1500 ✓
  - Updates: wallet.balance -= 1500
  - Updates: soldLands.add("TON-A1")
  - Updates: wallet.assets.lands.push("TON-A1")
  - Creates: new Transaction record
  - Creates: success Notification
         ↓
All Components Re-render:
  - Header: shows new balance (3500)
  - 3D Viewer: land changes to dark/sold appearance
  - Dashboard: owned lands count increments
  - Notification: "Successfully purchased TON-A1 for 1500 DOGG!"
```

## Benefits

### **Single Source of Truth**
All components read from the same AppDataContext - no data duplication.

### **Automatic Synchronization**
When data changes in context, all components update automatically via React re-renders.

### **Type Safety**
Full TypeScript interfaces ensure type-safe data access across all components.

### **Consistent State**
Wallet balance, land ownership, and transactions are always in sync across the entire application.

### **Easy Debugging**
All state changes happen in one place (AppDataContext), making it easy to track data flow.
