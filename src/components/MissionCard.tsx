import {
  IoGiftSharp,
  IoCheckmark,
} from "react-icons/io5";
export const MissionCard: React.FC<{
  mission: {
    id: number;
    title: string;
    description: string;
    reward: number;
    completed: boolean;
  };
  onClaim: (id: number) => void;
}> = ({ mission, onClaim }) => (
  <div className="bg-[#1c1c1e] border border-gray-800 rounded-2xl p-4">
    <div className="flex items-start justify-between mb-2">
      <div className="flex-1">
        <div className="font-semibold text-white mb-1">{mission.title}</div>
        <div className="text-sm text-gray-400">{mission.description}</div>
      </div>
      {mission.completed && (
        <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
          <IoCheckmark
            size={16}
            className="text-green-400"
          />
        </div>
      )}
    </div>
    <div className="flex items-center justify-between mt-3">
      <div className="flex items-center gap-2">
        <IoGiftSharp
          size={16}
          className="text-[#0A84FF]"
        />
        <span className="font-bold text-[#0A84FF]">{mission.reward} DOGG</span>
      </div>
      <button
        onClick={() => onClaim(mission.id)}
        disabled={mission.completed}
        className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
          mission.completed
            ? "bg-[#2c2c2e] text-gray-500 cursor-not-allowed border border-gray-800"
            : "bg-[#0A84FF] text-white active:scale-95"
        }`}
      >
        {mission.completed ? "Claimed" : "Claim"}
      </button>
    </div>
  </div>
);
