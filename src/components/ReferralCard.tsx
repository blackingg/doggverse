import {
  IoPeopleSharp,
  IoShareSocialSharp,
} from "react-icons/io5";
export const ReferralCard: React.FC<{
  friendsCount: number;
  earnedAmount: number;
  bonusPercent: number;
  onShare: () => void;
}> = ({ friendsCount, earnedAmount, bonusPercent, onShare }) => (
  <div className="bg-[#1c1c1e] border border-gray-800 rounded-2xl p-6">
    <div className="text-center mb-4">
      <div className="w-16 h-16 bg-pink-500/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
        <IoPeopleSharp
          size={32}
          className="text-pink-400"
        />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">Invite Friends</h3>
      <p className="text-sm text-gray-400">
        Earn {bonusPercent}% of your friends' transactions
      </p>
    </div>

    <div className="bg-[#000000] rounded-xl p-4 mb-4 border border-gray-800">
      <div className="w-24 h-24 bg-[#1c1c1e] rounded-xl mx-auto flex items-center justify-center border border-gray-800">
        <IoShareSocialSharp
          size={40}
          className="text-gray-600"
        />
      </div>
    </div>

    <button
      onClick={onShare}
      className="w-full bg-[#0A84FF] text-white py-4 rounded-xl font-semibold active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
    >
      <IoShareSocialSharp size={20} />
      Share Invite Link
    </button>

    <div className="mt-4 grid grid-cols-3 gap-3 text-center">
      <div>
        <div className="text-xl font-bold text-white">{friendsCount}</div>
        <div className="text-xs text-gray-400">Friends</div>
      </div>
      <div>
        <div className="text-xl font-bold text-white">{earnedAmount}</div>
        <div className="text-xs text-gray-400">Earned</div>
      </div>
      <div>
        <div className="text-xl font-bold text-white">{bonusPercent}%</div>
        <div className="text-xs text-gray-400">Bonus</div>
      </div>
    </div>
  </div>
);
