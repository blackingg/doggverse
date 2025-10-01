import React from "react";
import { IoRocketSharp } from "react-icons/io5";

export const ComingSoon: React.FC<{ title: string; description: string }> = ({
  title,
  description,
}) => (
  <div className="pb-20 min-h-screen flex items-center justify-center bg-[#000000]">
    <div className="text-center px-4">
      <div className="w-24 h-24 bg-[#0A84FF]/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
        <IoRocketSharp
          size={48}
          className="text-[#0A84FF]"
        />
      </div>
      <h1 className="text-3xl font-bold text-white mb-3">{title}</h1>
      <p className="text-gray-400 mb-8">{description}</p>
      <div className="inline-flex items-center gap-3 bg-[#1c1c1e] border border-gray-800 rounded-full px-6 py-3">
        <div className="w-2 h-2 bg-[#0A84FF] rounded-full animate-pulse" />
        <span className="text-sm font-medium text-gray-300">Coming Soon</span>
      </div>
    </div>
  </div>
);
