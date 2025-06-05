"use client";

import { useState } from "react";
import { FaInfoCircle, FaChevronDown, FaChevronUp } from "react-icons/fa";

interface InfoCalloutProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  defaultOpen?: boolean;
}

export function InfoCallout({ 
  title, 
  children, 
  icon = <FaInfoCircle className="h-5 w-5 text-blue-600" />,
  defaultOpen = false
}: InfoCalloutProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="mb-6 bg-blue-50 rounded-lg border border-blue-200 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-start p-4 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
      >
        <div className="flex-shrink-0 mt-0.5 mr-3">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-blue-800 flex justify-between items-center">
            {title}
            <span className="text-blue-500">
              {isOpen ? <FaChevronUp /> : <FaChevronDown />}
            </span>
          </h3>
        </div>
      </button>
      
      {isOpen && (
        <div className="px-4 pb-4 pt-0 ml-8">
          {children}
        </div>
      )}
    </div>
  );
} 