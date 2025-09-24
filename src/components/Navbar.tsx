import React from 'react';
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Moon, Sun, User, LogOut, DollarSign } from "lucide-react";
import { currencies } from "../utils/currency";
import expensioLogo from 'figma:asset/dec2d8be3eac93826e61213b3f4e39d825c8a8ab.png';

interface NavbarProps {
  user: { name: string; email: string };
  onLogout: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  currency: string;
  onCurrencyChange: (currency: string) => void;
  onNavigateToProfile?: () => void;
  onNavigateToDashboard?: () => void;
}

export function Navbar({ user, onLogout, darkMode, onToggleDarkMode, currency, onCurrencyChange, onNavigateToProfile, onNavigateToDashboard }: NavbarProps) {
  const selectedCurrency = currencies.find(c => c.code === currency);

  return (
    <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-white/20 dark:border-gray-800/20 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center">
        <button 
          onClick={onNavigateToDashboard}
          className="transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded-lg"
        >
          <img 
            src={expensioLogo} 
            alt="Expensio" 
            className="h-12 w-auto cursor-pointer"
          />
        </button>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <DollarSign className="h-4 w-4 text-muted-foreground" />
          <Select value={currency} onValueChange={onCurrencyChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue>
                <span className="flex items-center gap-2">
                  {selectedCurrency?.symbol} {selectedCurrency?.code}
                </span>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {currencies.map((curr) => (
                <SelectItem key={curr.code} value={curr.code}>
                  <span className="flex items-center gap-2">
                    {curr.symbol} {curr.code} - {curr.name}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleDarkMode}
        >
          {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                <AvatarFallback>
                  {user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <div className="flex flex-col space-y-1 p-2">
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onNavigateToProfile}>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}