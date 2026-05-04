import { useState } from 'react';
import Icon from '@/components/ui/icon';

interface DepositPageProps {
  onBalanceChange: (amount: number) => void;
  onNavigate: (page: string) => void;
}

const AMOUNTS = [200, 500, 1000, 2000, 5000, 10000];

export default function DepositPage({ onBalanceChange, onNavigate }: DepositPageProps) {
  const [amount, setAmount] = useState(1000);
  const [phone, setPhone] = useState('');
  const [step, setStep] = useState<'form' | 'pending' | 'success'>('form');

  const handleSubmit = () => {
    if (!phone || amount < 200) return;
    setStep('pending');
    setTimeout(() => {
      onBalanceChange(amount);
      setStep('success');
    }, 2500);
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-lg mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl font-bold text-white mb-2">ПОПОЛНЕНИЕ</h1>
          <p className="text-gray-400">Через Билайн — быстро и безопасно</p>
        </div>

        <div className="card-glass rounded-2xl p-6">
          {step === 'form' && (
            <>
              {/* Beeline header */}
              <div className="flex items-center gap-3 p-4 rounded-xl bg-[rgba(255,200,0,0.1)] border border-[rgba(255,200,0,0.2)] mb-6">
                <div className="w-10 h-10 rounded-full bg-[rgba(255,200,0,0.2)] flex items-center justify-center text-xl">🐝</div>
                <div>
                  <p className="text-white font-semibold">Оплата через Билайн</p>
                  <p className="text-gray-400 text-sm">Списание со счёта телефона</p>
                </div>
              </div>

              <div className="mb-4">
                <label className="text-gray-400 text-sm mb-2 block">Номер телефона Билайн</label>
                <div className="flex items-center gap-2 bg-[var(--dark-bg)] border border-[var(--card-border)] rounded-xl px-4 py-3 focus-within:border-[var(--neon-orange)] transition-colors">
                  <span className="text-gray-400">+7</span>
                  <input
                    type="tel"
                    placeholder="(999) 000-00-00"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="flex-1 bg-transparent text-white outline-none text-sm"
                    maxLength={11}
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="text-gray-400 text-sm mb-2 block">Сумма пополнения</label>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {AMOUNTS.map(a => (
                    <button
                      key={a}
                      onClick={() => setAmount(a)}
                      className={`py-2.5 rounded-xl text-sm font-bold transition-all ${
                        amount === a
                          ? 'btn-glow-orange text-white'
                          : 'bg-[var(--card-border)] text-gray-400 hover:text-white hover:bg-[rgba(255,140,0,0.1)]'
                      }`}
                    >
                      {a.toLocaleString('ru-RU')} ₽
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2 bg-[var(--dark-bg)] border border-[var(--card-border)] rounded-xl px-4 py-3 focus-within:border-[var(--neon-orange)] transition-colors">
                  <input
                    type="number"
                    value={amount}
                    onChange={e => setAmount(Math.max(200, parseInt(e.target.value) || 200))}
                    className="flex-1 bg-transparent text-white outline-none text-sm"
                  />
                  <span className="text-gray-400">₽</span>
                </div>
                <p className="text-gray-500 text-xs mt-1.5">Минимальная сумма: 200 ₽</p>
              </div>

              <div className="bg-[rgba(0,255,136,0.05)] border border-[rgba(0,255,136,0.15)] rounded-xl p-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Вы пополняете</span>
                  <span className="font-display text-xl font-bold text-white">{amount.toLocaleString('ru-RU')} ₽</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-gray-400 text-sm">Бонус (+5%)</span>
                  <span className="text-[var(--neon-green)] font-semibold">+{Math.floor(amount * 0.05).toLocaleString('ru-RU')} ₽</span>
                </div>
                <div className="border-t border-[var(--card-border)] mt-2 pt-2 flex justify-between">
                  <span className="text-white font-semibold">Итого на счёт</span>
                  <span className="font-display font-bold text-[var(--neon-green)] text-lg">{Math.floor(amount * 1.05).toLocaleString('ru-RU')} ₽</span>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={!phone || amount < 200}
                className="w-full py-4 rounded-xl btn-glow-orange text-white font-display font-bold text-xl disabled:opacity-50"
              >
                <Icon name="Smartphone" size={20} className="inline mr-2" />
                Пополнить через Билайн
              </button>
            </>
          )}

          {step === 'pending' && (
            <div className="text-center py-10">
              <div className="text-5xl mb-4 animate-float">🐝</div>
              <p className="font-display text-xl font-bold text-white mb-2">Обрабатываем платёж...</p>
              <p className="text-gray-400 text-sm">На ваш телефон может прийти SMS-подтверждение</p>
              <div className="mt-6 flex justify-center gap-1">
                {[0,1,2].map(i => (
                  <span
                    key={i}
                    className="w-2 h-2 rounded-full bg-[var(--neon-orange)] animate-bounce"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-10">
              <div className="text-5xl mb-4">✅</div>
              <p className="font-display text-2xl font-bold text-[var(--neon-green)] mb-2">
                +{amount.toLocaleString('ru-RU')} ₽
              </p>
              <p className="text-white font-semibold mb-1">Баланс пополнен!</p>
              <p className="text-gray-400 text-sm mb-6">Средства зачислены на ваш игровой счёт</p>
              <div className="flex gap-3">
                <button
                  onClick={() => onNavigate('miner')}
                  className="flex-1 py-3 rounded-xl btn-glow-orange text-white font-semibold"
                >
                  Играть
                </button>
                <button
                  onClick={() => { setStep('form'); setPhone(''); }}
                  className="flex-1 py-3 rounded-xl bg-[var(--card-border)] text-gray-300 font-semibold hover:text-white transition-colors"
                >
                  Ещё раз
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
