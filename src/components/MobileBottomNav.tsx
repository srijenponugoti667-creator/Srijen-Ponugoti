import React from 'react';
import { Home, Briefcase, FileText, FolderLock, Scale } from 'lucide-react';
import { getTranslation } from '../languages';

interface MobileBottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentLanguage?: string;
  isLawyer?: boolean;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  currentLanguage = 'en',
  isLawyer = false,
}) => {
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(currentLanguage, key);

  const navItems = [
    {
      id: 'home',
      label: t('overview'),
      icon: Home,
      color: 'text-red-400',
    },
    {
      id: 'lawyers',
      label: t('findLawyer'),
      icon: Briefcase,
      color: 'text-red-400',
    },
    {
      id: 'legal_docs',
      label: t('legalDocs'),
      icon: FileText,
      color: 'text-emerald-400',
      badge: 'PDF',
    },
    {
      id: 'my_cases',
      label: isLawyer ? 'Case Vault' : t('myCases'),
      icon: FolderLock,
      color: 'text-red-400',
    },
    {
      id: 'ai_assistant',
      label: t('aiCounsel'),
      icon: Scale,
      color: 'text-amber-400',
    },
  ];

  return (
    <div 
      id="mobile-bottom-navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 backdrop-blur-lg border-t border-zinc-800/80 px-2 py-1.5 flex items-center justify-around xl:hidden shadow-2xl safe-bottom"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        return (
          <button
            key={item.id}
            id={`bottom-nav-${item.id}`}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all relative ${
              isActive
                ? 'text-white font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className={`relative p-1 rounded-lg transition-all ${
              isActive 
                ? item.id === 'legal_docs' 
                  ? 'bg-emerald-950/80 text-emerald-300 ring-1 ring-emerald-500/50'
                  : 'bg-red-950/80 text-red-300 ring-1 ring-red-500/50'
                : ''
            }`}>
              <Icon className={`w-5 h-5 ${isActive ? (item.id === 'legal_docs' ? 'text-emerald-400' : 'text-red-400') : 'text-slate-400'}`} />
              
              {/* Badge for Legal Docs */}
              {item.badge && !isActive && (
                <span className="absolute -top-1 -right-1 text-[8px] font-black px-1 rounded-full bg-emerald-600 text-white leading-tight">
                  {item.badge}
                </span>
              )}
            </div>

            <span className={`text-[10px] tracking-tight mt-0.5 truncate max-w-[64px] ${
              isActive 
                ? item.id === 'legal_docs' 
                  ? 'text-emerald-300 font-bold'
                  : 'text-white font-bold'
                : 'text-slate-400 font-medium'
            }`}>
              {item.label}
            </span>

            {/* Active Indicator dot */}
            {isActive && (
              <span className={`w-1 h-1 rounded-full mt-0.5 ${
                item.id === 'legal_docs' ? 'bg-emerald-400' : 'bg-red-500'
              }`} />
            )}
          </button>
        );
      })}
    </div>
  );
};
