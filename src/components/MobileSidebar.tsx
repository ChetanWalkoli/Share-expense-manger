import React, { useState, useEffect, useRef } from 'react';
import { Button } from "./ui/button";
import { 
  MoreVertical, 
  LayoutDashboard, 
  Plus, 
  Brain, 
  History, 
  Users, 
  Calendar, 
  User,
  LogOut,
  X,
  Receipt
} from "lucide-react";

type Page = 'dashboard' | 'add-expense' | 'ai-insights' | 'history' | 'create-group' | 'future-expense' | 'profile' | 'expenses';

interface MobileSidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
  userName: string;
}

const navItems = [
  { id: 'dashboard' as Page, label: 'Dashboard', icon: LayoutDashboard },
  { id: 'add-expense' as Page, label: 'Add Expense', icon: Plus },
  { id: 'expenses' as Page, label: 'Expenses', icon: Receipt },
  { id: 'create-group' as Page, label: 'Create Group', icon: Users },
  { id: 'future-expense' as Page, label: 'Future Expense Plan', icon: Calendar },
  { id: 'ai-insights' as Page, label: 'AI Insights', icon: Brain },
  { id: 'history' as Page, label: 'History', icon: History },
  { id: 'profile' as Page, label: 'Profile', icon: User },
];

export function MobileSidebar({ currentPage, onNavigate, onLogout, userName }: MobileSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current && 
        !sidebarRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close sidebar on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleNavigate = (page: Page) => {
    onNavigate(page);
    setIsOpen(false);
  };

  const handleLogout = () => {
    onLogout();
    setIsOpen(false);
  };

  return (
    <>
      {/* Three-dot menu button */}
      <Button
        ref={buttonRef}
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border border-white/20 dark:border-gray-800/20 shadow-lg hover:shadow-xl transition-all duration-200 md:hidden"
        aria-label="Toggle menu"
      >
        <MoreVertical className="h-5 w-5" />
      </Button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sliding Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full w-80 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg text-foreground p-4 flex flex-col gap-3 z-50 transition-transform duration-300 ease-in-out transform shadow-2xl border-r border-white/20 dark:border-gray-800/20 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pt-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">💰</span>
            </div>
            <h2 className="font-semibold text-lg">Expensio</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="text-muted-foreground hover:text-foreground hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* User info */}
        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg p-3 mb-4 border border-white/20 dark:border-gray-700/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {userName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="font-medium text-sm">{userName}</p>
              <p className="text-muted-foreground text-xs">Welcome back!</p>
            </div>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 hover:bg-white/50 dark:hover:bg-gray-800/50 hover:translate-x-1 ${
                  isActive 
                    ? 'bg-black text-white shadow-lg' 
                    : 'text-foreground hover:text-foreground'
                }`}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Logout button */}
        <div className="border-t border-white/20 dark:border-gray-700/20 pt-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 hover:bg-red-500/20 text-muted-foreground hover:text-red-500"
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}