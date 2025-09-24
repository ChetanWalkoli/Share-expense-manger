import React from 'react';
import { Button } from "./ui/button";
import { LayoutDashboard, Plus, Brain, History } from "lucide-react";

type Page = 'dashboard' | 'add-expense' | 'ai-insights' | 'history';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const navItems = [
  { id: 'dashboard' as Page, label: 'Dashboard', icon: LayoutDashboard },
  { id: 'add-expense' as Page, label: 'Add Expense', icon: Plus },
  { id: 'ai-insights' as Page, label: 'AI Insights', icon: Brain },
  { id: 'history' as Page, label: 'History', icon: History },
];

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-card border-r border-border p-4">
      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <Button
              key={item.id}
              variant={isActive ? "secondary" : "ghost"}
              className={`w-full justify-start ${
                isActive ? 'bg-primary text-primary-foreground' : ''
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