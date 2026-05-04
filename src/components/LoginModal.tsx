import { useState } from 'react';
import Icon from '@/components/ui/icon';

const AUTH_URL = 'https://functions.poehali.dev/7808bd20-747a-451f-a808-afd066c8bddb';

interface UserData {
  id: number;
  login: string;
  display_name: string;
  balance: number;
}

interface LoginModalProps {
  onClose: () => void;
  onLogin: (user: UserData) => void;
}

type Step = 'form' | 'success';

export default function LoginModal({ onClose, onLogin }: LoginModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [loginInput, setLoginInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<Step>('form');
  const [createdCreds, setCreatedCreds] = useState<{ login: string; password: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(AUTH_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'register' }),
      });
      const data = await res.json();
      if (data.ok) {
        setCreatedCreds({ login: data.login, password: data.password });
        setStep('success');
        onLogin({ id: data.id, login: data.login, display_name: data.display_name, balance: data.balance });
      } else {
        setError('Ошибка при регистрации. Попробуй ещё раз.');
      }
    } catch {
      setError('Ошибка соединения.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(AUTH_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', login: loginInput, password: passwordInput }),
      });
      const data = await res.json();
      if (data.ok) {
        onLogin({ id: data.id, login: data.login, display_name: data.display_name, balance: data.balance });
        onClose();
      } else {
        setError(data.error || 'Неверный логин или пароль');
      }
    } catch {
      setError('Ошибка соединения.');
    } finally {
      setLoading(false);
    }
  };

  const copyAll = () => {
    if (!createdCreds) return;
    navigator.clipboard?.writeText(`Логин: ${createdCreds.login}\nПароль: ${createdCreds.password}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (step === 'success' && createdCreds) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
        <div className="relative card-glass rounded-2xl p-6 w-full max-w-sm animate-scale-in border border-[rgba(0,255,136,0.2)]">
          <div className="text-center mb-5">
            <div className="text-4xl mb-3">🎉</div>
            <h2 className="font-display text-2xl font-bold text-white">АККАУНТ СОЗДАН!</h2>
            <p className="text-[var(--neon-green)] text-sm mt-1">Начальный баланс: 500 ₽</p>
          </div>

          <div className="bg-[rgba(255,140,0,0.06)] border border-[rgba(255,140,0,0.2)] rounded-xl p-4 mb-4">
            <p className="text-gray-400 text-xs mb-3 uppercase tracking-wider font-semibold">Сохрани данные для входа</p>

            <div className="space-y-3">
              <div>
                <p className="text-gray-500 text-xs mb-1">Логин</p>
                <div className="flex items-center gap-2 bg-[var(--dark-bg)] rounded-lg px-3 py-2">
                  <span className="text-white font-mono font-bold text-sm flex-1">{createdCreds.login}</span>
                  <Icon name="User" size={14} className="text-[var(--neon-orange)]" />
                </div>
              </div>

              <div>
                <p className="text-gray-500 text-xs mb-1">Пароль</p>
                <div className="flex items-center gap-2 bg-[var(--dark-bg)] rounded-lg px-3 py-2">
                  <span className="text-white font-mono font-bold text-sm flex-1 tracking-widest">{createdCreds.password}</span>
                  <Icon name="Lock" size={14} className="text-[var(--neon-orange)]" />
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={copyAll}
            className="w-full py-2.5 mb-3 rounded-xl border border-[rgba(255,140,0,0.3)] text-[var(--neon-orange)] text-sm font-semibold hover:bg-[rgba(255,140,0,0.08)] transition-all flex items-center justify-center gap-2"
          >
            <Icon name={copied ? 'Check' : 'Copy'} size={15} />
            {copied ? 'Скопировано!' : 'Скопировать логин и пароль'}
          </button>

          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl btn-glow-orange text-white font-display font-bold text-lg"
          >
            Начать играть →
          </button>

          <p className="text-gray-600 text-xs text-center mt-4">⚠️ Сохрани данные — восстановление не предусмотрено</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative card-glass rounded-2xl p-6 w-full max-w-sm animate-scale-in border border-[rgba(255,140,0,0.15)]">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
          <Icon name="X" size={20} />
        </button>

        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl btn-glow-orange flex items-center justify-center text-white font-display font-bold text-2xl mx-auto mb-3">N</div>
          <h2 className="font-display text-2xl font-bold text-white">
            {mode === 'login' ? 'ВХОД В NEXUS' : 'РЕГИСТРАЦИЯ'}
          </h2>
          {mode === 'register' && (
            <p className="text-[var(--neon-green)] text-sm mt-1">🎁 Стартовый баланс 500 ₽</p>
          )}
        </div>

        {mode === 'register' ? (
          <div className="space-y-4">
            <div className="text-center py-4">
              <p className="text-gray-300 text-sm leading-relaxed mb-2">
                Нажми кнопку — и мы мгновенно создадим аккаунт и выдадим твои данные для входа.
              </p>
              <p className="text-gray-500 text-xs">Ничего вводить не нужно!</p>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-[rgba(255,51,102,0.1)] border border-[rgba(255,51,102,0.3)] text-[var(--neon-red)] text-sm text-center">
                {error}
              </div>
            )}

            <button
              onClick={handleRegister}
              disabled={loading}
              className="w-full py-4 rounded-xl btn-glow-orange text-white font-display font-bold text-xl disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Создаём аккаунт...
                </span>
              ) : '⚡ Создать аккаунт'}
            </button>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-3">
            <div>
              <label className="text-gray-400 text-sm mb-1.5 block">Логин</label>
              <div className="flex items-center gap-2 bg-[var(--dark-bg)] border border-[var(--card-border)] rounded-xl px-4 py-3 focus-within:border-[var(--neon-orange)] transition-colors">
                <Icon name="User" size={15} className="text-gray-500" />
                <input
                  type="text"
                  placeholder="ДикийВолк1234"
                  value={loginInput}
                  onChange={e => setLoginInput(e.target.value)}
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
                  value={passwordInput}
                  onChange={e => setPasswordInput(e.target.value)}
                  className="flex-1 bg-transparent text-white text-sm outline-none"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-[rgba(255,51,102,0.1)] border border-[rgba(255,51,102,0.3)] text-[var(--neon-red)] text-sm text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !loginInput || !passwordInput}
              className="w-full py-3.5 rounded-xl btn-glow-orange text-white font-display font-bold text-lg mt-2 disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Входим...
                </span>
              ) : 'Войти'}
            </button>
          </form>
        )}

        <div className="mt-4 text-center">
          {mode === 'login' ? (
            <p className="text-gray-500 text-sm">
              Нет аккаунта?{' '}
              <button onClick={() => { setMode('register'); setError(''); }} className="text-[var(--neon-orange)] font-semibold hover:underline">
                Зарегистрироваться
              </button>
            </p>
          ) : (
            <p className="text-gray-500 text-sm">
              Уже есть аккаунт?{' '}
              <button onClick={() => { setMode('login'); setError(''); }} className="text-[var(--neon-orange)] font-semibold hover:underline">
                Войти
              </button>
            </p>
          )}
        </div>

        {mode === 'register' && (
          <p className="text-gray-600 text-xs text-center mt-3">
            Регистрируясь, вы подтверждаете что вам 18+ лет
          </p>
        )}
      </div>
    </div>
  );
}
