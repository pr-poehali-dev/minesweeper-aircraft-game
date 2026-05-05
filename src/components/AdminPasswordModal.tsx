import { useState, useRef, useEffect } from 'react';
import Icon from '@/components/ui/icon';

interface AdminPasswordModalProps {
  onSuccess: () => void;
  onClose: () => void;
}

export default function AdminPasswordModal({ onSuccess, onClose }: AdminPasswordModalProps) {
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value === '2007') {
      onSuccess();
    } else {
      setError(true);
      setValue('');
      setTimeout(() => setError(false), 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative card-glass rounded-2xl p-6 w-full max-w-xs animate-scale-in transition-all ${error ? 'border border-[rgba(255,51,102,0.5)]' : 'border border-[rgba(255,140,0,0.15)]'}`}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
          <Icon name="X" size={18} />
        </button>

        <div className="text-center mb-5">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3 transition-all ${error ? 'bg-[rgba(255,51,102,0.15)]' : 'bg-[rgba(255,140,0,0.1)]'}`}>
            {error ? '🚫' : '🛡'}
          </div>
          <h2 className="font-display text-xl font-bold text-white">АДМИН-ПАНЕЛЬ</h2>
          <p className="text-gray-500 text-sm mt-1">Введите пароль для доступа</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={`flex items-center gap-2 bg-[var(--dark-bg)] border rounded-xl px-4 py-3 mb-3 transition-colors ${error ? 'border-[rgba(255,51,102,0.5)]' : 'border-[var(--card-border)] focus-within:border-[var(--neon-orange)]'}`}>
            <Icon name="Lock" size={15} className={error ? 'text-[var(--neon-red)]' : 'text-gray-500'} />
            <input
              ref={inputRef}
              type="password"
              placeholder="••••"
              value={value}
              onChange={e => setValue(e.target.value)}
              className="flex-1 bg-transparent text-white text-sm outline-none tracking-widest"
              maxLength={20}
            />
          </div>

          {error && (
            <p className="text-[var(--neon-red)] text-xs text-center mb-3">Неверный пароль</p>
          )}

          <button
            type="submit"
            disabled={!value}
            className="w-full py-3 rounded-xl btn-glow-orange text-white font-display font-bold disabled:opacity-50"
          >
            Войти
          </button>
        </form>
      </div>
    </div>
  );
}
