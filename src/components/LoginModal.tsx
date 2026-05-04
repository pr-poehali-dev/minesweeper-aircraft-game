import { useState } from 'react';
import Icon from '@/components/ui/icon';

interface LoginModalProps {
  onClose: () => void;
  onLogin: () => void;
}

export default function LoginModal({ onClose, onLogin }: LoginModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative card-glass rounded-2xl p-6 w-full max-w-sm animate-scale-in border border-[rgba(255,140,0,0.15)]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
        >
          <Icon name="X" size={20} />
        </button>

        {/* Logo */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl btn-glow-orange flex items-center justify-center text-white font-display font-bold text-2xl mx-auto mb-3">
            N
          </div>
          <h2 className="font-display text-2xl font-bold text-white">
            {mode === 'login' ? 'ВХОД В NEXUS' : 'РЕГИСТРАЦИЯ'}
          </h2>
          {mode === 'register' && (
            <p className="text-[var(--neon-green)] text-sm mt-1">🎁 +100% к первому депозиту</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === 'register' && (
            <div>
              <label className="text-gray-400 text-sm mb-1.5 block">Имя игрока</label>
              <div className="flex items-center gap-2 bg-[var(--dark-bg)] border border-[var(--card-border)] rounded-xl px-4 py-3 focus-within:border-[var(--neon-orange)] transition-colors">
                <Icon name="User" size={15} className="text-gray-500" />
                <input
                  type="text"
                  placeholder="Ваш никнейм"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="flex-1 bg-transparent text-white text-sm outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-gray-400 text-sm mb-1.5 block">Телефон</label>
            <div className="flex items-center gap-2 bg-[var(--dark-bg)] border border-[var(--card-border)] rounded-xl px-4 py-3 focus-within:border-[var(--neon-orange)] transition-colors">
              <Icon name="Phone" size={15} className="text-gray-500" />
              <input
                type="tel"
                placeholder="+7 (999) 000-00-00"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="flex-1 bg-transparent text-white text-sm outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-gray-400 text-sm mb-1.5 block">Пароль</label>
            <div className="flex items-center gap-2 bg-[var(--dark-bg)] border border-[var(--card-border)] rounded-xl px-4 py-3 focus-within:border-[var(--neon-orange)] transition-colors">
              <Icon name="Lock" size={15} className="text-gray-500" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="flex-1 bg-transparent text-white text-sm outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl btn-glow-orange text-white font-display font-bold text-lg mt-2"
          >
            {mode === 'login' ? 'Войти' : 'Создать аккаунт'}
          </button>
        </form>

        <div className="mt-4 text-center">
          {mode === 'login' ? (
            <p className="text-gray-500 text-sm">
              Нет аккаунта?{' '}
              <button onClick={() => setMode('register')} className="text-[var(--neon-orange)] font-semibold hover:underline">
                Зарегистрироваться
              </button>
            </p>
          ) : (
            <p className="text-gray-500 text-sm">
              Уже есть аккаунт?{' '}
              <button onClick={() => setMode('login')} className="text-[var(--neon-orange)] font-semibold hover:underline">
                Войти
              </button>
            </p>
          )}
        </div>

        <p className="text-gray-600 text-xs text-center mt-4">
          Регистрируясь, вы подтверждаете что вам 18+ лет
        </p>
      </div>
    </div>
  );
}
