import React from 'react';
import { Button } from "./ui/button";
import { LayoutDashboard, Plus, Brain, History, Users, Calendar, User, Receipt } from "lucide-react";

type Page = 'dashboard' | 'add-expense' | 'ai-insights' | 'history' | 'create-group' | 'future-expense' | 'profile' | 'expenses';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
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

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg border-r border-white/20 dark:border-gray-800/20 p-4">
      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <Button
              key={item.id}
              variant={isActive ? "secondary" : "ghost"}
              className={`w-full justify-start transition-all duration-200 ease-in-out hover:scale-105 ${
                isActive 
                  ? 'bg-primary text-primary-foreground scale-105' 
                  : 'hover:bg-secondary hover:text-secondary-foreground'
              }`}
              onClick={() => onNavigate(item.id)}
            >
              <Icon className="mr-2 h-4 w-4" />
              {item.label}
            </Button>
          );
        })}
      </nav>
    </aside>
  );
}