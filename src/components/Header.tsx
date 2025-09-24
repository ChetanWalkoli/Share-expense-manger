import React, { useState } from 'react';
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import expensioLogo from 'figma:asset/dec2d8be3eac93826e61213b3f4e39d825c8a8ab.png';

interface HeaderProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export function Header({ onToggleSidebar, isSidebarOpen }: HeaderProps) {
  return (
    <header className="bg-card border-b border-border h-16 px-4 flex items-center justify-start gap-4 shadow-sm sticky top-0 z-40">
      {/* Hamburger Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleSidebar}
        className="h-10 w-10 transition-all duration-200 hover:bg-accent md:hidden"
        aria-label="Toggle menu"
      >
        {isSidebarOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </Button>

      {/* Spacing between hamburger and logo */}
      <div className="w-2 md:hidden" />

      {/* App Logo */}
      <div className="flex items-center">
        <img 
          src={expensioLogo} 
          alt="Expensio" 
          className="h-8 w-auto md:h-10 md:w-auto transition-all duration-200"
        />
      </div>

      {/* Spacer for future header items */}
      <div className="flex-1" />
    </header>
  );
}