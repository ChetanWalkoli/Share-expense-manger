import React, { useState, useEffect } from 'react';
import { Toaster } from "./components/ui/sonner";
import { LoginSignup } from './components/LoginSignup';
import { Dashboard } from './components/Dashboard';
import { AddExpense } from './components/AddExpense';
import { AIInsights } from './components/AIInsights';
import { History } from './components/History';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';

type Page = 'login' | 'dashboard' | 'add-expense' | 'ai-insights' | 'history';

interface User {
  name: string;
  email: string;
  avatar?: string;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [user, setUser] = useState<User | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check for saved dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleLogin = (userData: User) => {
    setUser(userData);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('login');
  };

  const navigateTo = (page: Page) => {
    setCurrentPage(page);
  };

  if (!user) {
    return (
      <>
        <LoginSignup onLogin={handleLogin} />
        <Toaster />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar 
        user={user} 
        onLogout={handleLogout}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
      />
      
      <div className="flex">
        <Sidebar currentPage={currentPage} onNavigate={navigateTo} />
        
        <main className="flex-1 p-6 md:p-8 ml-64">
          {currentPage === 'dashboard' && <Dashboard />}
          {currentPage === 'add-expense' && <AddExpense />}
          {currentPage === 'ai-insights' && <AIInsights />}
          {currentPage === 'history' && <History />}
        </main>
      </div>
      
      <Toaster />
    </div>
  );
}