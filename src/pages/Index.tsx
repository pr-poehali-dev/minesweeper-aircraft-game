import { useState } from 'react';
import Navbar from '@/components/Navbar';
import LoginModal from '@/components/LoginModal';
import HomePage from '@/pages/HomePage';
import MinerPage from '@/pages/MinerPage';
import AviatrixPage from '@/pages/AviatrixPage';
import ProfilePage from '@/pages/ProfilePage';
import DepositPage from '@/pages/DepositPage';
import WithdrawPage from '@/pages/WithdrawPage';
import BonusPage from '@/pages/BonusPage';
import SupportPage from '@/pages/SupportPage';
import AdminPage from '@/pages/AdminPage';

interface UserData {
  id: number;
  login: string;
  display_name: string;
  balance: number;
}

export default function Index() {
  const [page, setPage] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [balance, setBalance] = useState(0);
  const [showLogin, setShowLogin] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);

  const handleBalanceChange = (amount: number) => {
    setBalance(prev => Math.max(0, prev + amount));
  };

  const handleLogin = (user: UserData) => {
    setIsLoggedIn(true);
    setShowLogin(false);
    setUserData(user);
    setBalance(user.balance);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setPage('home');
    setUserData(null);
    setBalance(0);
  };

  const openLogin = () => setShowLogin(true);

  const navigateTo = (p: string) => {
    if ((p === 'profile' || p === 'deposit' || p === 'withdraw') && !isLoggedIn) {
      setShowLogin(true);
      return;
    }
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--dark-bg)' }}>
      <Navbar
        currentPage={page}
        onNavigate={navigateTo}
        balance={balance}
        isLoggedIn={isLoggedIn}
        onLogin={openLogin}
        onLogout={handleLogout}
      />

      {page === 'home' && (
        <HomePage onNavigate={navigateTo} isLoggedIn={isLoggedIn} onLogin={openLogin} />
      )}
      {page === 'miner' && (
        <MinerPage balance={balance} onBalanceChange={handleBalanceChange} isLoggedIn={isLoggedIn} onLogin={openLogin} />
      )}
      {page === 'aviatrix' && (
        <AviatrixPage balance={balance} onBalanceChange={handleBalanceChange} isLoggedIn={isLoggedIn} onLogin={openLogin} />
      )}
      {page === 'profile' && isLoggedIn && (
        <ProfilePage balance={balance} onNavigate={navigateTo} userLogin={userData?.login} />
      )}
      {page === 'deposit' && isLoggedIn && (
        <DepositPage onBalanceChange={handleBalanceChange} onNavigate={navigateTo} />
      )}
      {page === 'withdraw' && isLoggedIn && (
        <WithdrawPage balance={balance} onBalanceChange={handleBalanceChange} onNavigate={navigateTo} />
      )}
      {page === 'bonuses' && (
        <BonusPage onBalanceChange={handleBalanceChange} isLoggedIn={isLoggedIn} onLogin={openLogin} />
      )}
      {page === 'support' && (
        <SupportPage isLoggedIn={isLoggedIn} onLogin={openLogin} />
      )}
      {page === 'admin' && (
        <AdminPage />
      )}

      {isLoggedIn && (
        <button
          onClick={() => setPage('admin')}
          className="fixed bottom-6 right-6 w-10 h-10 rounded-full bg-[rgba(255,140,0,0.1)] border border-[rgba(255,140,0,0.2)] text-[var(--neon-orange)] flex items-center justify-center opacity-20 hover:opacity-100 transition-opacity z-40"
          title="Панель администратора"
        >
          🛡
        </button>
      )}

      {showLogin && (
        <LoginModal onClose={() => setShowLogin(false)} onLogin={handleLogin} />
      )}
    </div>
  );
}