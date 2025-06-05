"use client";
import { marketingTemplates } from "@/mock-data";
import { useRouter } from "next/navigation";

export default function TemplateCards({ handleStart }: { handleStart: (query: string) => void }) {
    const router = useRouter();
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {marketingTemplates.map((tpl) => (
          <button
            key={tpl.title}
            onClick={() => handleStart(tpl.query)}
            className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg hover:border-blue-300 transition-all text-left group flex flex-col"
          >
            <div className="relative h-40 w-full group">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 z-10" />
              <img
                src={tpl.image}
                alt={tpl.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 z-20">
                <tpl.icon className="w-6 h-6 text-white" />
              </div>
              {/* Hover buttons */}
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-200 flex flex-col items-center justify-center gap-3 z-30">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/dashboard/templates/${tpl.query}`);
                  }}
                  className="px-5 py-2 bg-white/90 text-gray-800 rounded-full text-sm font-medium hover:bg-white transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  View Details
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStart(tpl.query);
                  }}
                  className="px-5 py-2 bg-blue-600/90 text-white rounded-full text-sm font-medium hover:bg-blue-600 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Open in Hoook
                </button>
              </div>
            </div>
            <div className="p-6 flex-1">
              <div className="font-bold text-gray-800 mb-1">{tpl.title}</div>
              <div className="text-gray-500 text-sm">{tpl.description}</div>
            </div>
            {/* Author section */}
            <div className="flex items-center gap-2 px-6 pb-4">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center font-semibold text-white"
                style={{ backgroundColor: "#6366f1" }}
              >
                {tpl.author.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </div>
              <span className="text-gray-700 text-sm font-medium">{tpl.author.name}</span>
              <span className="text-gray-400 text-xs ml-auto">{tpl.author.forks.toLocaleString()} Forks</span>
            </div>
          </button>
        ))}
      </div>
    )
}