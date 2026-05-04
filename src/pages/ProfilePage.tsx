import Icon from '@/components/ui/icon';

interface ProfilePageProps {
  balance: number;
  onNavigate: (page: string) => void;
  userLogin?: string;
}

const historyItems = [
  { game: 'Майнер', type: 'win', amount: 450, mult: '4.5×', date: '05.05 14:22' },
  { game: 'Авиатрикс', type: 'loss', amount: -200, mult: '1.04×', date: '05.05 13:45' },
  { game: 'Майнер', type: 'win', amount: 1200, mult: '12×', date: '05.05 12:10' },
  { game: 'Авиатрикс', type: 'win', amount: 380, mult: '3.8×', date: '04.05 22:33' },
  { game: 'Майнер', type: 'loss', amount: -100, mult: '💣', date: '04.05 21:15' },
  { game: 'Пополнение', type: 'deposit', amount: 2000, mult: '—', date: '04.05 20:00' },
  { game: 'Вывод', type: 'withdraw', amount: -1500, mult: '—', date: '03.05 18:40' },
];

const stats = [
  { label: 'Всего игр', value: '247' },
  { label: 'Побед', value: '134' },
  { label: 'Макс. выигрыш', value: '12 400 ₽' },
  { label: 'Кэшбек доступен', value: '340 ₽' },
];

export default function ProfilePage({ balance, onNavigate, userLogin }: ProfilePageProps) {
  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl font-bold text-white mb-2">ЛИЧНЫЙ КАБИНЕТ</h1>
        </div>

        {/* Profile header */}
        <div className="card-glass rounded-2xl p-6 mb-6 flex flex-col sm:flex-row items-center gap-6">
          <div className="w-20 h-20 rounded-2xl btn-glow-orange flex items-center justify-center text-4xl">
            🎮
          </div>
          <div className="text-center sm:text-left flex-1">
            <h2 className="font-display text-2xl font-bold text-white">{userLogin || 'Игрок'}</h2>
            <p className="text-gray-400 text-sm mt-1">VIP Статус: Серебряный 🥈</p>
            <div className="flex items-center gap-2 mt-2 justify-center sm:justify-start">
              <span className="w-2 h-2 rounded-full bg-[var(--neon-green)]" />
              <span className="text-[var(--neon-green)] text-sm">В сети</span>
            </div>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-1">Баланс</p>
            <p className="font-display text-3xl font-bold text-[var(--neon-green)]">{balance.toLocaleString('ru-RU')} ₽</p>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => onNavigate('deposit')}
            className="flex items-center justify-center gap-2 py-4 rounded-xl btn-glow-orange text-white font-display font-bold text-lg"
          >
            <Icon name="Plus" size={20} />
            Пополнить
          </button>
          <button
            onClick={() => onNavigate('withdraw')}
            className="flex items-center justify-center gap-2 py-4 rounded-xl btn-glow-cyan text-white font-display font-bold text-lg"
          >
            <Icon name="ArrowUpRight" size={20} />
            Вывести
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {stats.map(s => (
            <div key={s.label} className="card-glass rounded-xl p-4 text-center">
              <p className="font-display text-xl font-bold text-white">{s.value}</p>
              <p className="text-gray-500 text-xs mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* History */}
        <div className="card-glass rounded-2xl p-5">
          <h3 className="font-display text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Icon name="History" size={18} className="text-[var(--neon-orange)]" />
            История операций
          </h3>
          <div className="space-y-2">
            {historyItems.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-3 px-4 rounded-xl bg-[rgba(30,36,56,0.5)] hover:bg-[rgba(30,36,56,0.8)] transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">
                    {item.type === 'win' ? '💎' : item.type === 'loss' ? '💣' : item.type === 'deposit' ? '💰' : '💳'}
                  </span>
                  <div>
                    <p className="text-white text-sm font-semibold">{item.game}</p>
                    <p className="text-gray-500 text-xs">{item.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-display font-bold ${item.amount > 0 ? 'text-[var(--neon-green)]' : 'text-[var(--neon-red)]'}`}>
                    {item.amount > 0 ? '+' : ''}{item.amount.toLocaleString('ru-RU')} ₽
                  </p>
                  <p className="text-gray-500 text-xs">{item.mult}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}