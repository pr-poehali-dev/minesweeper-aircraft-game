import { useState } from 'react';
import Icon from '@/components/ui/icon';

interface WithdrawPageProps {
  balance: number;
  onBalanceChange: (amount: number) => void;
  onNavigate: (page: string) => void;
}

export default function WithdrawPage({ balance, onBalanceChange, onNavigate }: WithdrawPageProps) {
  const [amount, setAmount] = useState(1000);
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [step, setStep] = useState<'form' | 'pending' | 'success'>('form');

  const formatCard = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(\d{4})/g, '$1 ').trim();
  };

  const handleSubmit = () => {
    if (!cardNumber || !cardName || amount < 500 || amount > balance) return;
    setStep('pending');
    onBalanceChange(-amount);
    setTimeout(() => setStep('success'), 3000);
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-lg mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl font-bold text-white mb-2">ВЫВОД СРЕДСТВ</h1>
          <p className="text-gray-400">На карту СБП — без комиссии, за 5 минут</p>
        </div>

        <div className="card-glass rounded-2xl p-6">
          {step === 'form' && (
            <>
              {/* SBP header */}
              <div className="flex items-center gap-3 p-4 rounded-xl bg-[rgba(0,136,255,0.1)] border border-[rgba(0,136,255,0.2)] mb-6">
                <div className="w-10 h-10 rounded-full bg-[rgba(0,136,255,0.2)] flex items-center justify-center text-xl">🏦</div>
                <div>
                  <p className="text-white font-semibold">Система быстрых платежей (СБП)</p>
                  <p className="text-gray-400 text-sm">Сбербанк, Тинькофф, Альфа и другие</p>
                </div>
              </div>

              <div className="bg-[rgba(255,140,0,0.08)] border border-[rgba(255,140,0,0.2)] rounded-xl px-4 py-3 mb-5 flex justify-between">
                <span className="text-gray-400 text-sm">Ваш баланс</span>
                <span className="font-display font-bold text-[var(--neon-orange)]">{balance.toLocaleString('ru-RU')} ₽</span>
              </div>

              <div className="mb-4">
                <label className="text-gray-400 text-sm mb-2 block">Номер карты</label>
                <div className="flex items-center gap-2 bg-[var(--dark-bg)] border border-[var(--card-border)] rounded-xl px-4 py-3 focus-within:border-[var(--neon-cyan)] transition-colors">
                  <Icon name="CreditCard" size={16} className="text-gray-500" />
                  <input
                    type="text"
                    placeholder="0000 0000 0000 0000"
                    value={cardNumber}
                    onChange={e => setCardNumber(formatCard(e.target.value))}
                    className="flex-1 bg-transparent text-white outline-none text-sm tracking-widest"
                    maxLength={19}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="text-gray-400 text-sm mb-2 block">Имя держателя карты</label>
                <div className="flex items-center gap-2 bg-[var(--dark-bg)] border border-[var(--card-border)] rounded-xl px-4 py-3 focus-within:border-[var(--neon-cyan)] transition-colors">
                  <Icon name="User" size={16} className="text-gray-500" />
                  <input
                    type="text"
                    placeholder="IVAN IVANOV"
                    value={cardName}
                    onChange={e => setCardName(e.target.value.toUpperCase())}
                    className="flex-1 bg-transparent text-white outline-none text-sm uppercase tracking-wider"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="text-gray-400 text-sm mb-2 block">Сумма вывода</label>
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {[500, 1000, 2000, 5000].map(a => (
                    <button
                      key={a}
                      onClick={() => setAmount(Math.min(a, balance))}
                      className={`py-2 rounded-xl text-xs font-bold transition-all ${
                        amount === a ? 'btn-glow-cyan text-white' : 'bg-[var(--card-border)] text-gray-400 hover:text-white'
                      }`}
                    >
                      {a >= 1000 ? `${a/1000}К` : a}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2 bg-[var(--dark-bg)] border border-[var(--card-border)] rounded-xl px-4 py-3 focus-within:border-[var(--neon-cyan)] transition-colors">
                  <input
                    type="number"
                    value={amount}
                    onChange={e => setAmount(Math.min(parseInt(e.target.value) || 0, balance))}
                    className="flex-1 bg-transparent text-white outline-none text-sm"
                  />
                  <span className="text-gray-400">₽</span>
                </div>
                {amount > balance && (
                  <p className="text-[var(--neon-red)] text-xs mt-1.5">Недостаточно средств</p>
                )}
                <p className="text-gray-500 text-xs mt-1.5">Минимальная сумма: 500 ₽ · Без комиссии</p>
              </div>

              <button
                onClick={handleSubmit}
                disabled={!cardNumber || !cardName || amount < 500 || amount > balance}
                className="w-full py-4 rounded-xl btn-glow-cyan text-white font-display font-bold text-xl disabled:opacity-50"
              >
                <Icon name="ArrowUpRight" size={20} className="inline mr-2" />
                Вывести {amount.toLocaleString('ru-RU')} ₽
              </button>
            </>
          )}

          {step === 'pending' && (
            <div className="text-center py-10">
              <div className="text-5xl mb-4 animate-float">💳</div>
              <p className="font-display text-xl font-bold text-white mb-2">Обрабатываем заявку...</p>
              <p className="text-gray-400 text-sm">Обычно занимает от 1 до 5 минут</p>
              <div className="mt-6 flex justify-center gap-1">
                {[0, 1, 2].map(i => (
                  <span key={i} className="w-2 h-2 rounded-full bg-[var(--neon-cyan)] animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />
                ))}
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-10">
              <div className="text-5xl mb-4">✅</div>
              <p className="font-display text-2xl font-bold text-[var(--neon-green)] mb-2">Заявка принята!</p>
              <p className="text-white font-semibold mb-1">Средства отправлены</p>
              <p className="text-gray-400 text-sm mb-2">На карту •••• {cardNumber.slice(-4)}</p>
              <p className="text-gray-500 text-xs mb-6">Поступят в течение 5 минут</p>
              <button
                onClick={() => onNavigate('profile')}
                className="w-full py-3 rounded-xl btn-glow-orange text-white font-semibold"
              >
                В личный кабинет
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
