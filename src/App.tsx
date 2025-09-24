import React, { useState, useEffect, createContext, useContext } from 'react';
import { Toaster } from "./components/ui/sonner";
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { AddExpense } from './components/AddExpense';
import { EnhancedAddExpense } from './components/EnhancedAddExpense';
import { MobileSidebar } from './components/MobileSidebar';
import { AIInsights } from './components/AIInsights';
import { History } from './components/History';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { CreateGroup } from './components/CreateGroup';
import { FutureExpense } from './components/FutureExpense';
import { Profile } from './components/Profile';
import { Expenses } from './components/Expenses';

type Page = 'login' | 'dashboard' | 'add-expense' | 'ai-insights' | 'history' | 'create-group' | 'future-expense' | 'profile' | 'expenses';

interface User {
  name: string;
  email: string;
  avatar?: string;
}

interface CurrencyContextType {
  currency: string;
  setCurrency: (currency: string) => void;
}

export const CurrencyContext = createContext<CurrencyContextType>({
  currency: 'USD',
  setCurrency: () => {},
});

export const useCurrency = () => useContext(CurrencyContext);

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [user, setUser] = useState<User | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [currency, setCurrency] = useState('USD');

  useEffect(() => {
    // Check for saved dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    }

    // Check for saved currency preference
    const savedCurrency = localStorage.getItem('currency') || 'USD';
    setCurrency(savedCurrency);
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

  const handleCurrencyChange = (newCurrency: string) => {
    setCurrency(newCurrency);
    localStorage.setItem('currency', newCurrency);
  };

  if (!user) {
    return (
      <>
        <LandingPage onLogin={handleLogin} />
        <Toaster />
      </>
    );
  }

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency: handleCurrencyChange }}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-green-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"></div>
        </div>

        {/* Content with relative positioning */}
        <div className="relative z-10">
          <Navbar 
            user={user} 
            onLogout={handleLogout}
            darkMode={darkMode}
            onToggleDarkMode={toggleDarkMode}
            currency={currency}
            onCurrencyChange={handleCurrencyChange}
            onNavigateToProfile={() => navigateTo('profile')}
            onNavigateToDashboard={() => navigateTo('dashboard')}
          />
          
          {/* Mobile Sidebar */}
          <MobileSidebar 
            currentPage={currentPage} 
            onNavigate={navigateTo} 
            onLogout={handleLogout}
            userName={user.name}
          />

          <div className="flex">
            {/* Desktop Sidebar */}
            <div className="hidden md:block">
              <Sidebar currentPage={currentPage} onNavigate={navigateTo} />
            </div>
            
            <main className="flex-1 p-6 md:p-8 md:ml-64">
              {currentPage === 'dashboard' && <Dashboard />}
              {currentPage === 'add-expense' && <EnhancedAddExpense />}
              {currentPage === 'ai-insights' && <AIInsights />}
              {currentPage === 'history' && <History />}
              {currentPage === 'create-group' && <CreateGroup />}
              {currentPage === 'future-expense' && <FutureExpense />}
              {currentPage === 'profile' && <Profile />}
              {currentPage === 'expenses' && <Expenses />}
            </main>
          </div>
        </div>
        
        <Toaster />
      </div>
    </CurrencyContext.Provider>
  );
}