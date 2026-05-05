import { useState } from 'react';
import Icon from '@/components/ui/icon';

interface NavItem {
  id: string;
  label: string;
  icon: string;
}

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  balance: number;
  isLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
}

export default function Navbar({ currentPage, onNavigate, balance, isLoggedIn, onLogin, onLogout }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems: NavItem[] = [
    { id: 'home', label: 'Главная', icon: 'Home' },
    { id: 'miner', label: 'Майнер', icon: 'Grid3x3' },
    { id: 'aviatrix', label: 'Авиатрикс', icon: 'Plane' },
    { id: 'bonuses', label: 'Бонусы', icon: 'Gift' },
    { id: 'support', label: 'Поддержка', icon: 'MessageCircle' },
    { id: 'admin', label: 'Админ', icon: 'ShieldCheck' },
  ];

  if (isLoggedIn) {
    navItems.push({ id: 'profile', label: 'Кабинет', icon: 'User' });
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 card-glass border-b border-[var(--card-border)]">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <button onClick={() => onNavigate('home')} className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg btn-glow-orange flex items-center justify-center text-white font-display font-bold text-sm">N</div>
          <span className="font-display text-xl font-bold text-white tracking-wider">NEXUS</span>
        </button>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                currentPage === item.id
                  ? 'text-[var(--neon-orange)] bg-[rgba(255,140,0,0.1)]'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon name={item.icon} fallback="Circle" size={15} />
              {item.label}
            </button>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <button
                onClick={() => onNavigate('deposit')}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[rgba(0,255,136,0.1)] border border-[rgba(0,255,136,0.2)] text-[var(--neon-green)] text-sm font-semibold hover:bg-[rgba(0,255,136,0.2)] transition-all"
              >
                <Icon name="Wallet" size={14} />
                {balance.toLocaleString('ru-RU')} ₽
              </button>
              <button
                onClick={() => onNavigate('withdraw')}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg btn-glow-orange text-white text-sm font-semibold"
              >
                <Icon name="ArrowUpRight" size={14} />
                Вывод
              </button>
              <button onClick={onLogout} className="text-gray-500 hover:text-gray-300 transition-colors">
                <Icon name="LogOut" size={18} />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onLogin}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-300 hover:text-white hover:bg-white/5 transition-all"
              >
                Войти
              </button>
              <button
                onClick={onLogin}
                className="px-4 py-2 rounded-lg btn-glow-orange text-white text-sm font-semibold"
              >
                Регистрация
              </button>
            </>
          )}

          {/* Mobile menu */}
          <button
            className="md:hidden text-gray-400 hover:text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Icon name={menuOpen ? 'X' : 'Menu'} size={22} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-[var(--card-border)] bg-[var(--dark-bg)] px-4 py-3 space-y-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => { onNavigate(item.id); setMenuOpen(false); }}
              className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                currentPage === item.id
                  ? 'text-[var(--neon-orange)] bg-[rgba(255,140,0,0.1)]'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon name={item.icon} fallback="Circle" size={16} />
              {item.label}
            </button>
          ))}
          {isLoggedIn && (
            <div className="pt-2 border-t border-[var(--card-border)] flex gap-2">
              <button
                onClick={() => { onNavigate('deposit'); setMenuOpen(false); }}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[rgba(0,255,136,0.1)] border border-[rgba(0,255,136,0.2)] text-[var(--neon-green)] text-sm font-semibold"
              >
                <Icon name="Wallet" size={14} />
                {balance.toLocaleString('ru-RU')} ₽
              </button>
              <button
                onClick={() => { onNavigate('withdraw'); setMenuOpen(false); }}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg btn-glow-orange text-white text-sm font-semibold"
              >
                <Icon name="ArrowUpRight" size={14} />
                Вывод
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}