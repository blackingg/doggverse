# 🐕 Doggverse - Metaverse Land Marketplace

A premium Telegram Mini App built with React, TypeScript, and Three.js for buying and trading virtual lands across three unique metaverse islands.

## 🌟 Features

### 🏝️ **Three Unique Islands**
- **TONVERSE** - Blue-themed island with 25 plots
- **Notverse** - Green-themed island with 25 plots  
- **Xverse** - Purple/Orange-themed island with 25 plots

### 🎮 **Interactive 3D Exploration**
- Immersive 3D viewer built with Three.js
- **Touch controls** optimized for mobile:
  - Swipe to rotate camera
  - Pinch to zoom
  - Tap to select lands
- **Desktop controls**:
  - Mouse drag to rotate
  - Scroll to zoom
  - Click to select

### 💎 **Smart Land System**
- Real-time ownership tracking via centralized data context
- **Visual color coding**:
  - Vibrant colors for available lands
  - Dark muted appearance (#2c2c2e) with red glow for sold lands
  - Golden glow for premium properties
- **Smart filtering**: Filter by availability, ownership, premium status, or island
- Color blending maintains island identity when filtering

### 💰 **Integrated Wallet System**
- DOGG token balance management
- Complete transaction history
- Purchase flow with balance validation
- Real-time notifications on all actions

### 🔔 **Notification System**
- Success/error/info/warning notifications
- Transaction confirmations
- Purchase receipts
- Auto-managed notification queue (max 50)

## 🏗️ Architecture

### **Centralized Data Management**
All application state is managed through `AppDataContext` - a single context provider that ensures data consistency across the entire app:

```typescript
const { wallet, islands, lands, soldLands, purchaseLand } = useAppData();
```

**What it manages:**
- Wallet balance, address, and owned assets
- 3 islands with unique configurations
- All 75 land plots with metadata
- Sold lands tracking (Set)
- Complete transaction history
- Notification queue

**Integrated components:**
- ✅ HomePage - Displays balance, stats, islands
- ✅ EarnPage - Updates balance on mission rewards
- ✅ LandsPageAlt - Complete 3D marketplace with purchase flow  
- ✅ DashboardPage - Wallet management and transactions
- ✅ Header - Displays balance from context

**📖 For detailed architecture documentation**, see [CENTRALIZED_DATA.md](./CENTRALIZED_DATA.md)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/blackingg/doggverse.git

# Navigate to project directory
cd doggverse

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

### Build for Production

```bash
# Build the app
pnpm build

# Preview production build
pnpm preview
```

## 📱 Deployment

Optimized for Telegram Mini Apps with:
- Safe area insets handling
- Viewport fit coverage
- Touch-optimized UI
- Mobile-first responsive design

Deploy to Vercel, Netlify, or any static hosting service.

## 🛠️ Tech Stack

### **Core**
- **React 18** - UI framework
- **TypeScript 5** - Type safety
- **Vite** - Build tool and dev server

### **3D Graphics**
- **Three.js** - 3D rendering engine
- Custom camera controls (spherical coordinates)
- Raycasting for object selection
- Dynamic lighting and shadows

### **Styling**
- **Tailwind CSS** - Utility-first CSS
- Custom animations (slideUp, slideDown)
- Glassmorphism effects (`backdrop-blur`)
- Dark theme optimized (#000000, #1c1c1e, #2c2c2e)

### **State Management**
- React Context API
- Custom hooks (`useAppData`, `useTelegram`, `useNotifications`)
- Centralized data store (AppDataContext)

### **Icons**
- **React Icons** (Ionicons 5)

## 📂 Project Structure

```
doggverse/
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── Header.tsx
│   │   ├── Modal.tsx
│   │   ├── TabNavigation.tsx
│   │   └── ...
│   ├── context/          # React Context providers
│   │   ├── AppDataContext.tsx    # Centralized state
│   │   ├── TelegramContext.tsx   # Telegram WebApp integration
│   │   └── NotificationContext.tsx
│   ├── pages/            # Page components
│   │   ├── HomePage.tsx
│   │   ├── LandsPageAlt.tsx      # 3D land viewer
│   │   ├── EarnPage.tsx
│   │   └── DashboardPage.tsx
│   ├── types/            # TypeScript type definitions
│   │   └── index.ts
│   ├── App.tsx           # Main app component
│   ├── main.tsx          # Entry point
│   └── index.css         # Global styles
├── public/               # Static assets
├── CENTRALIZED_DATA.md   # Architecture documentation
└── README.md            # This file
```

## 🎨 Design Philosophy

### **Premium Telegram-Style UI**
- Dark theme (#000000 background)
- Telegram blue (#0A84FF) accents
- Glassmorphism and blur effects
- Smooth micro-animations
- Touch-optimized interactions

### **Mobile-First Approach**
- Optimized for Telegram Mobile
- Touch gesture support (swipe, pinch, tap)
- Safe area handling for notches
- Responsive layouts

### **Performance Optimized**
- Efficient 3D rendering with requestAnimationFrame
- Proper event listener cleanup
- Optimized re-renders via React Context
- Small bundle size

## 🔐 Data Consistency

The app uses a **single source of truth** pattern with AppDataContext:

**Example: Land Purchase Flow**
```typescript
// User clicks "Buy Now"
purchaseLand(landId, price)
  ↓
// Context handles everything automatically:
- Validates balance ✓
- Deducts payment ✓
- Updates ownership ✓
- Logs transaction ✓
- Shows notification ✓
  ↓
// All components update automatically:
- Header shows new balance
- 3D viewer updates land color
- Dashboard updates stats
- Notification appears
```

## 🧪 Development

### Available Scripts

```bash
pnpm dev       # Start dev server
pnpm build     # Build for production
pnpm preview   # Preview production build
pnpm lint      # Run ESLint
```

### Environment Variables

No environment variables required for basic setup. For Telegram integration, the app must be loaded within Telegram WebApp context.

## 📝 License

This project is licensed under the MIT License.

---

**Personal project showcasing modern web technologies and 3D interactive experiences.**
