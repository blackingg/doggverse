export const SectionHeader: React.FC<{
  title: string;
  actionText?: string;
  onAction?: () => void;
}> = ({ title, actionText, onAction }) => (
  <div className="flex items-center justify-between mb-3">
    <h3 className="text-lg font-semibold text-white">{title}</h3>
    {actionText && (
      <button
        onClick={onAction}
        className="text-[#0A84FF] text-sm font-medium"
      >
        {actionText}
      </button>
    )}
  </div>
);
