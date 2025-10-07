import {
  IoWalletSharp,
  IoTrendingUpSharp,
  IoAddSharp,
} from "react-icons/io5";

export const BalanceCard: React.FC<{
  balance: number;
  onWithdraw?: () => void;
  onBuyMore?: () => void;
}> = ({ balance, onWithdraw, onBuyMore }) => (
  <div className="bg-gradient-to-br from-[#0A84FF] to-[#0051D5] rounded-2xl p-6 text-white">
    <div className="flex items-center gap-2 text-sm opacity-90 mb-2">
      <IoWalletSharp size={16} />
      Total Balance
    </div>
    <div className="text-4xl font-bold mb-4">{balance} DOGG</div>
    <div className="flex gap-3">
      <button
        onClick={onWithdraw}
        className="flex-1 bg-white/20 backdrop-blur py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
      >
        <IoTrendingUpSharp size={18} />
        Withdraw
      </button>
      <button
        onClick={onBuyMore}
        className="flex-1 bg-white text-[#0A84FF] py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
      >
        <IoAddSharp size={18} />
        Buy More
      </button>
    </div>
  </div>
);
