/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  LayoutDashboard, 
  Users, 
  Kanban, 
  History, 
  Settings, 
  Menu, 
  ChevronLeft, 
  Sun, 
  Moon,
  LogOut,
  Building2
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'leads', label: 'Leads', icon: Users },
    { id: 'pipeline', label: 'Pipeline', icon: Kanban },
    { id: 'activities', label: 'Activities', icon: History },
  ];

  return (
    <motion.div 
      initial={false}
      animate={{ width: isCollapsed ? '72px' : '240px' }}
      className={cn(
        "h-screen bg-sidebar-bg flex flex-col transition-colors duration-300 overflow-hidden shrink-0",
        isCollapsed ? "items-center" : "items-stretch"
      )}
    >
      {/* Brand */}
      <div className="h-20 flex items-center px-6 shrink-0 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-primary-700 flex items-center justify-center text-white">
            <Building2 size={20} />
          </div>
          {!isCollapsed && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="font-extrabold text-xl tracking-tighter text-white"
            >
              Tara Tools
            </motion.div>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center gap-4 px-6 py-4 transition-all duration-200 group relative border-l-[3px]",
              activeTab === item.id 
                ? "bg-white/5 text-white border-primary-700 font-bold"
                : "text-zinc-500 border-transparent hover:text-zinc-300 hover:bg-white/5"
            )}
          >
            <item.icon size={18} className={cn(
              "shrink-0",
              activeTab === item.id ? "text-primary-600" : "text-zinc-500 group-hover:text-zinc-300"
            )} />
            {!isCollapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[0.9rem]">
                {item.label}
              </motion.span>
            )}
          </button>
        ))}
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 space-y-2 shrink-0">
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-3 rounded-xl text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-all",
            isCollapsed && "justify-center"
          )}
          title="Toggle Theme"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          {!isCollapsed && <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-3 rounded-xl text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-all",
            isCollapsed && "justify-center"
          )}
          title="Toggle Sidebar"
        >
          {isCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
          {!isCollapsed && <span>Collapse</span>}
        </button>
      </div>
    </motion.div>
  );
}
