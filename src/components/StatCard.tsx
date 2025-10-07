export const StatCard: React.FC<{
  label: string;
  value: string | number;
}> = ({ label, value }) => (
  <div className="bg-[#1c1c1e] rounded-xl p-4 text-center border border-gray-800">
    <div className="text-2xl font-bold text-white">{value}</div>
    <div className="text-xs text-gray-400 mt-1">{label}</div>
  </div>
);
