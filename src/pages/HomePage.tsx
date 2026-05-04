import Icon from '@/components/ui/icon';

interface HomePageProps {
  onNavigate: (page: string) => void;
  isLoggedIn: boolean;
  onLogin: () => void;
}

const stats = [
  { label: 'Активных игроков', value: '14 832', icon: 'Users' },
  { label: 'Выплачено сегодня', value: '2.4М ₽', icon: 'TrendingUp' },
  { label: 'Максимальный выигрыш', value: '450 000 ₽', icon: 'Trophy' },
  { label: 'Текущий онлайн', value: '1 247', icon: 'Zap' },
];

const games = [
  {
    id: 'miner',
    name: 'Майнер 5×5',
    desc: 'Открывай клетки, избегай мины. Чем больше открыто — тем выше коэффициент!',
    img: 'https://cdn.poehali.dev/projects/81c22ef3-a9dd-47b9-9a80-99e87794b370/files/8c91c235-f65d-4b3e-9e3a-ead86d6a38d9.jpg',
    tag: 'ПОПУЛЯРНО',
    tagColor: 'bg-[rgba(255,140,0,0.2)] text-[var(--neon-orange)] border border-[rgba(255,140,0,0.3)]',
    maxWin: 'до 25×',
    color: 'var(--neon-orange)',
  },
  {
    id: 'aviatrix',
    name: 'Авиатрикс',
    desc: 'Самолёт набирает высоту — успей забрать выигрыш до крушения!',
    img: 'https://cdn.poehali.dev/projects/81c22ef3-a9dd-47b9-9a80-99e87794b370/files/dc41146a-86bc-45a2-b16f-24493aea371d.jpg',
    tag: 'ГОРЯЧО',
    tagColor: 'bg-[rgba(255,51,102,0.2)] text-[var(--neon-red)] border border-[rgba(255,51,102,0.3)]',
    maxWin: 'до 100×',
    color: 'var(--neon-red)',
  },
];

export default function HomePage({ onNavigate, isLoggedIn, onLogin }: HomePageProps) {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(https://cdn.poehali.dev/projects/81c22ef3-a9dd-47b9-9a80-99e87794b370/files/16bf8b00-22ad-4b72-8974-ea91470ffef9.jpg)` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0C12] via-[rgba(10,12,18,0.85)] to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0C12] via-transparent to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-20">
          <div className="max-w-2xl animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[rgba(255,140,0,0.1)] border border-[rgba(255,140,0,0.2)] text-[var(--neon-orange)] text-xs font-semibold mb-6">
              <span className="w-2 h-2 rounded-full bg-[var(--neon-orange)] animate-pulse" />
              ОНЛАЙН: 1 247 игроков
            </div>

            <h1 className="font-display text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
              ИГРАЙ.<br />
              <span className="neon-orange">ПОБЕЖДАЙ.</span><br />
              ВЫВОДИ.
            </h1>
            <p className="text-gray-300 text-lg md:text-xl mb-8 leading-relaxed">
              Лучшие игры с честными коэффициентами. Мгновенные выплаты на карту СБП. Ежедневные бонусы для активных игроков.
            </p>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={isLoggedIn ? () => onNavigate('miner') : onLogin}
                className="px-8 py-4 rounded-xl btn-glow-orange text-white font-display font-bold text-lg tracking-wide"
              >
                🎮 Начать играть
              </button>
              <button
                onClick={() => onNavigate('bonuses')}
                className="px-8 py-4 rounded-xl border border-[rgba(255,255,255,0.15)] text-white font-semibold hover:bg-white/5 transition-all"
              >
                Бонусы и акции
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 border-y border-[var(--card-border)] bg-[rgba(17,21,32,0.6)]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Icon name={stat.icon} fallback="Star" size={16} className="text-[var(--neon-orange)]" />
                  <span className="font-display text-2xl font-bold text-white">{stat.value}</span>
                </div>
                <p className="text-gray-500 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Games */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl font-bold text-white mb-3">НАШИ ИГРЫ</h2>
            <p className="text-gray-400">Проверенные игры с прозрачными алгоритмами</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {games.map(game => (
              <div key={game.id} className="game-card rounded-2xl overflow-hidden cursor-pointer" onClick={() => onNavigate(game.id)}>
                <div className="relative h-52 overflow-hidden">
                  <img src={game.img} alt={game.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111520] via-transparent to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className={`px-2 py-1 rounded-md text-xs font-bold ${game.tagColor}`}>{game.tag}</span>
                  </div>
                  <div className="absolute top-3 right-3 px-2 py-1 rounded-md bg-black/50 text-xs font-bold" style={{ color: game.color }}>
                    {game.maxWin}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-display text-xl font-bold text-white mb-2">{game.name}</h3>
                  <p className="text-gray-400 text-sm mb-4">{game.desc}</p>
                  <button
                    className="w-full py-2.5 rounded-xl font-semibold text-sm transition-all"
                    style={{
                      background: `linear-gradient(135deg, ${game.color}33, ${game.color}11)`,
                      border: `1px solid ${game.color}44`,
                      color: game.color,
                    }}
                  >
                    Играть →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-[rgba(17,21,32,0.4)]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: 'Shield', title: 'Честная игра', desc: 'Все результаты генерируются криптографически. Проверь любой раунд.', color: 'var(--neon-cyan)' },
              { icon: 'Zap', title: 'Мгновенные выплаты', desc: 'Вывод на карту СБП за 5 минут. Без задержек и комиссий.', color: 'var(--neon-orange)' },
              { icon: 'Gift', title: 'Бонусы каждый день', desc: 'Ежедневный бонус, кэшбек 10% и эксклюзивные акции.', color: 'var(--neon-green)' },
            ].map(f => (
              <div key={f.title} className="card-glass rounded-2xl p-6 hover:scale-[1.02] transition-transform">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: `${f.color}18`, border: `1px solid ${f.color}33` }}>
                  <Icon name={f.icon} fallback="Star" size={22} style={{ color: f.color }} />
                </div>
                <h3 className="font-display text-lg font-bold text-white mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      {!isLoggedIn && (
        <section className="py-20">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <h2 className="font-display text-4xl font-bold text-white mb-4">ГОТОВ НАЧАТЬ?</h2>
            <p className="text-gray-400 mb-8">Зарегистрируйся и получи бонус при первом пополнении</p>
            <button
              onClick={onLogin}
              className="px-10 py-4 rounded-xl btn-glow-orange text-white font-display font-bold text-xl tracking-wide animate-pulse-glow"
            >
              Получить бонус →
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
