import { useState } from 'react';
import Icon from '@/components/ui/icon';

interface BonusPageProps {
  onBalanceChange: (amount: number) => void;
  isLoggedIn: boolean;
  onLogin: () => void;
}

const bonuses = [
  {
    id: 'daily',
    icon: '🎁',
    title: 'Ежедневный бонус',
    desc: 'Заходи каждый день и получай бонус. Серия дней увеличивает награду!',
    reward: '50–500 ₽',
    color: 'var(--neon-orange)',
    available: true,
    streak: 7,
  },
  {
    id: 'cashback',
    icon: '💰',
    title: 'Кэшбек 10%',
    desc: '10% от проигранных средств за неделю. Начисляется каждый понедельник.',
    reward: 'до 10%',
    color: 'var(--neon-cyan)',
    available: false,
    nextDate: 'Пн, 12 мая',
  },
  {
    id: 'first',
    icon: '🚀',
    title: 'Бонус на первый депозит',
    desc: '+100% к первому пополнению. Действует только один раз!',
    reward: '+100%',
    color: 'var(--neon-green)',
    available: false,
    tag: 'Использован',
  },
  {
    id: 'ref',
    icon: '👥',
    title: 'Реферальная программа',
    desc: 'Приглашай друзей и получай 5% от каждого их пополнения навсегда.',
    reward: '5% с друга',
    color: '#AA88FF',
    available: true,
  },
];

const promos = [
  { title: 'Турнир недели', desc: 'Топ-3 игрока в Майнере получают 5 000, 3 000 и 1 000 ₽', ends: '08.05.2026', hot: true },
  { title: 'Двойной кэшбек', desc: 'Только 6-7 мая — кэшбек 20% вместо стандартных 10%', ends: '07.05.2026', hot: true },
  { title: 'Бонус за выходные', desc: '+30% к пополнению по субботам и воскресеньям', ends: 'Каждые выходные', hot: false },
];

export default function BonusPage({ onBalanceChange, isLoggedIn, onLogin }: BonusPageProps) {
  const [dailyClaimed, setDailyClaimed] = useState(false);
  const [refLink] = useState('nexus.gg/ref/14832');

  const claimDaily = () => {
    if (!isLoggedIn) { onLogin(); return; }
    const reward = 50 + Math.floor(Math.random() * 450);
    onBalanceChange(reward);
    setDailyClaimed(true);
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl font-bold text-white mb-2">
            БОНУСЫ И <span className="neon-orange">АКЦИИ</span>
          </h1>
          <p className="text-gray-400">Максимальная выгода для активных игроков</p>
        </div>

        {/* Bonuses */}
        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          {bonuses.map(bonus => (
            <div
              key={bonus.id}
              className="card-glass rounded-2xl p-5"
              style={{ borderColor: `${bonus.color}22`, borderWidth: '1px', borderStyle: 'solid' }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background: `${bonus.color}18` }}
                >
                  {bonus.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-display font-bold text-white">{bonus.title}</h3>
                    {'tag' in bonus && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[rgba(255,255,255,0.1)] text-gray-400">{bonus.tag}</span>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm mb-3">{bonus.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-display font-bold" style={{ color: bonus.color }}>{bonus.reward}</span>
                    {'streak' in bonus && (
                      <span className="text-xs text-gray-500">🔥 Серия: {bonus.streak} дней</span>
                    )}
                    {'nextDate' in bonus && (
                      <span className="text-xs text-gray-500">📅 {bonus.nextDate}</span>
                    )}
                  </div>
                </div>
              </div>

              {bonus.id === 'daily' && (
                <button
                  onClick={dailyClaimed ? undefined : claimDaily}
                  disabled={dailyClaimed}
                  className={`w-full mt-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                    dailyClaimed
                      ? 'bg-[rgba(0,255,136,0.1)] border border-[rgba(0,255,136,0.3)] text-[var(--neon-green)] cursor-default'
                      : 'btn-glow-orange text-white'
                  }`}
                >
                  {dailyClaimed ? '✓ Получено!' : 'Получить бонус'}
                </button>
              )}

              {bonus.id === 'ref' && (
                <div className="mt-4 flex gap-2">
                  <div className="flex-1 bg-[var(--dark-bg)] border border-[var(--card-border)] rounded-lg px-3 py-2 text-gray-300 text-sm font-mono">
                    {refLink}
                  </div>
                  <button
                    className="px-3 py-2 rounded-lg bg-[rgba(170,136,255,0.15)] border border-[rgba(170,136,255,0.3)] text-[#AA88FF] text-sm font-semibold hover:bg-[rgba(170,136,255,0.25)] transition-all"
                    onClick={() => navigator.clipboard?.writeText(refLink)}
                  >
                    <Icon name="Copy" size={15} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Promo */}
        <h2 className="font-display text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <Icon name="Flame" size={22} className="text-[var(--neon-orange)]" />
          Акции
        </h2>
        <div className="space-y-3">
          {promos.map((promo, i) => (
            <div key={i} className="card-glass rounded-xl p-5 flex items-center gap-4">
              {promo.hot && (
                <span className="flex-shrink-0 px-2 py-1 rounded-md text-xs font-bold bg-[rgba(255,51,102,0.2)] text-[var(--neon-red)] border border-[rgba(255,51,102,0.3)]">
                  🔥 HOT
                </span>
              )}
              <div className="flex-1">
                <h4 className="text-white font-semibold">{promo.title}</h4>
                <p className="text-gray-400 text-sm mt-0.5">{promo.desc}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-gray-500 text-xs">До {promo.ends}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
