import React from 'react';
import { Pustu } from '../types';
import { Building2, AlertTriangle, Users } from 'lucide-react';

interface PustuTabsProps {
  pustuList: Pustu[];
  activePustuId: string;
  onSelectPustu: (id: string) => void;
  getCounts: (pustuId: string) => { total: number; risk: number };
}

export const PustuTabs: React.FC<PustuTabsProps> = ({
  pustuList,
  activePustuId,
  onSelectPustu,
  getCounts,
}) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar border-b border-[#F9D5E2]">
      {pustuList.map((pustu) => {
        const isActive = pustu.id === activePustuId;
        const counts = getCounts(pustu.id);

        return (
          <button
            key={pustu.id}
            onClick={() => onSelectPustu(pustu.id)}
            className={`group relative flex items-center gap-2 px-5 py-3 rounded-t-2xl font-heading text-sm sm:text-base font-semibold transition-all cursor-pointer whitespace-nowrap -mb-px border-b-2 ${
              isActive
                ? 'bg-white text-[#15805D] border-[#15805D] shadow-xs'
                : 'text-gray-500 hover:text-gray-800 hover:bg-white/60 border-transparent'
            }`}
          >
            <Building2
              size={18}
              className={isActive ? 'text-[#15805D]' : 'text-gray-400 group-hover:text-gray-600'}
            />
            <span>{pustu.label}</span>

            {/* Total Badge */}
            <span
              className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-bold ${
                isActive
                  ? 'bg-[#E6F7F0] text-[#15805D]'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              <Users size={12} />
              {counts.total}
            </span>

            {/* High Risk indicator */}
            {counts.risk > 0 && (
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-[#FEE2E2] text-[#E11D48] border border-[#FECDD3]"
                title={`${counts.risk} ibu risiko tinggi`}
              >
                <AlertTriangle size={11} />
                {counts.risk} Risti
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
