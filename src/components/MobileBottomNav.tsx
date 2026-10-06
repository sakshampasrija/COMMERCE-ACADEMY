import React from 'react';
import { useApp } from '../context/AppContext';
import { Calendar, CheckCircle2, CreditCard, Users, GraduationCap } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();

  const navItems = [
    { id: 'batches', label: 'Batches', icon: Calendar },
    { id: 'attendance', label: 'Attendance', icon: CheckCircle2 },
    { id: 'fees', label: 'Fees', icon: CreditCard },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'tests', label: 'Tests', icon: GraduationCap },
  ] as const;

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-t border-slate-200 z-40 px-2 flex items-center justify-around shadow-[0_-4px_6px_-1px_rgba(15,23,42,0.05)]"
      aria-label="Mobile Navigation"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center w-full h-full py-1 text-center transition-colors min-h-[44px] min-w-[44px] ${
              isActive
                ? 'text-[#1d4ed8] font-bold'
                : 'text-slate-500 hover:text-slate-900 font-medium'
            }`}
          >
            <Icon className={`w-5 h-5 mb-1 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
            <span className="text-[10px] tracking-tight">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
