export const ActionCard: React.FC<{
  icon: React.ComponentType<{ size: number; className?: string }>;
  iconColor: string;
  iconBg: string;
  title: string;
  subtitle?: string;
  onClick?: () => void;
}> = ({ icon: Icon, iconColor, iconBg, title, subtitle, onClick }) => (
  <button
    onClick={onClick}
    className="bg-[#1c1c1e] border border-gray-800 rounded-xl p-4 text-center active:scale-95 transition-transform"
  >
    <div
      className={`w-10 h-10 ${iconBg} rounded-xl flex items-center justify-center mx-auto mb-2`}
    >
      <Icon
        size={20}
        className={iconColor}
      />
    </div>
    <div className="text-xs font-semibold text-white">{title}</div>
    {subtitle && <div className="text-xs text-gray-400 mt-1">{subtitle}</div>}
  </button>
);
