import { IoClose } from "react-icons/io5";
export const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-[#1c1c1e] rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md border-t border-gray-800 animate-[slideUp_0.3s_ease-out]">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">{title}</h3>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-[#2c2c2e] rounded-full flex items-center justify-center text-white hover:bg-[#3c3c3e] transition-colors"
            >
              <IoClose size={20} />
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};
