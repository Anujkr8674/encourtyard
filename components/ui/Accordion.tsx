'use client';

import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { FAQItem } from '@/types';

export interface AccordionProps {
  items: FAQItem[];
  defaultOpenIndex?: number;
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  defaultOpenIndex = 0,
  className = ''
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpenIndex);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={`divide-y divide-[#E5E1D8] border-y border-[#E5E1D8] ${className}`}>
      {items.map((item, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div key={item.id} className="py-5 transition-colors duration-200">
            <button
              onClick={() => toggleItem(idx)}
              className="flex w-full items-start justify-between text-left gap-4 focus:outline-none group cursor-pointer"
              aria-expanded={isOpen}
            >
              <span className="text-base sm:text-lg font-medium text-[#181F18] group-hover:text-[#263626] transition-colors pr-2">
                {item.question}
              </span>
              <span className="shrink-0 mt-0.5 p-1 rounded-full bg-[#F2EEE7] text-[#263626] group-hover:bg-[#E3EBE3] transition-colors">
                {isOpen ? (
                  <Minus className="w-4 h-4" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
              </span>
            </button>
            {isOpen && (
              <div className="mt-3.5 pr-8 text-sm sm:text-base leading-relaxed text-[#5C665C] animate-fadeIn">
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
