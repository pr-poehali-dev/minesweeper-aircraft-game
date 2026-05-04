import { useState } from 'react';
import Icon from '@/components/ui/icon';

type Tab = 'users' | 'deposits' | 'withdrawals' | 'settings';

const users = [
  { id: 14832, name: 'Игрок #14832', balance: 3450, status: 'active', games: 247, reg: '01.03.2024' },
  { id: 14831, name: 'Игрок #14831', balance: 1200, status: 'active', games: 89, reg: '15.03.2024' },
  { id: 14830, name: 'Игрок #14830', balance: 0, status: 'blocked', games: 14, reg: '20.03.2024' },
  { id: 14829, name: 'Игрок #14829', balance: 8900, status: 'vip', games: 512, reg: '01.01.2024' },
  { id: 14828, name: 'Игрок #14828', balance: 250, status: 'active', games: 33, reg: '28.04.2024' },
];

const deposits = [
  { id: 1, user: '#14832', amount: 2000, method: 'Билайн', time: '05.05 14:00', status: 'completed' },
  { id: 2, user: '#14831', amount: 500, method: 'Билайн', time: '05.05 13:20', status: 'completed' },
  { id: 3, user: '#14829', amount: 10000, method: 'Билайн', time: '05.05 12:45', status: 'completed' },
  { id: 4, user: '#14828', amount: 300, method: 'Билайн', time: '05.05 11:00', status: 'pending' },
];

const withdrawals = [
  { id: 1, user: '#14832', amount: 1500, card: '•••• 4321', time: '03.05 18:40', status: 'completed' },
  { id: 2, user: '#14829', amount: 5000, card: '•••• 8899', time: '04.05 10:00', status: 'pending' },
  { id: 3, user: '#14831', amount: 800, card: '•••• 1122', time: '05.05 09:30', status: 'pending' },
];

const STATUS_COLORS: Record<string, string> = {
  active: 'text-[var(--neon-green)] bg-[rgba(0,255,136,0.1)]',
  blocked: 'text-[var(--neon-red)] bg-[rgba(255,51,102,0.1)]',
  vip: 'text-[#AA88FF] bg-[rgba(170,136,255,0.1)]',
  completed: 'text-[var(--neon-green)] bg-[rgba(0,255,136,0.1)]',
  pending: 'text-[var(--neon-orange)] bg-[rgba(255,140,0,0.1)]',
};

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('users');
  const [searchQ, setSearchQ] = useState('');

  const adminStats = [
    { label: 'Всего игроков', value: users.length, icon: 'Users', color: 'var(--neon-cyan)' },
    { label: 'Депозиты сегодня', value: '12 800 ₽', icon: 'TrendingUp', color: 'var(--neon-green)' },
    { label: 'Заявок на вывод', value: withdrawals.filter(w => w.status === 'pending').length, icon: 'Clock', color: 'var(--neon-orange)' },
    { label: 'Ожидают', value: deposits.filter(d => d.status === 'pending').length, icon: 'AlertCircle', color: 'var(--neon-red)' },
  ];

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'users', label: 'Пользователи', icon: 'Users' },
    { id: 'deposits', label: 'Пополнения', icon: 'ArrowDownLeft' },
    { id: 'withdrawals', label: 'Выводы', icon: 'ArrowUpRight' },
    { id: 'settings', label: 'Настройки', icon: 'Settings' },
  ];

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-4xl font-bold text-white">АДМИН-ПАНЕЛЬ</h1>
            <p className="text-gray-400 mt-1">Управление платформой NEXUS</p>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-[rgba(255,140,0,0.1)] border border-[rgba(255,140,0,0.2)] text-[var(--neon-orange)] text-sm font-semibold">
            🛡 Администратор
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {adminStats.map(s => (
            <div key={s.label} className="card-glass rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon name={s.icon} fallback="Star" size={16} style={{ color: s.color }} />
                <span className="text-gray-400 text-xs">{s.label}</span>
              </div>
              <p className="font-display text-2xl font-bold text-white">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-[rgba(17,21,32,0.8)] p-1 rounded-xl w-fit">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                tab === t.id ? 'btn-glow-orange text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Icon name={t.icon} fallback="Circle" size={14} />
              {t.label}
            </button>
          ))}
        </div>

        {/* Search */}
        {tab !== 'settings' && (
          <div className="flex items-center gap-2 bg-[var(--dark-bg)] border border-[var(--card-border)] rounded-xl px-4 py-2.5 mb-4 max-w-xs">
            <Icon name="Search" size={15} className="text-gray-500" />
            <input
              type="text"
              placeholder="Поиск..."
              value={searchQ}
              onChange={e => setSearchQ(e.target.value)}
              className="bg-transparent text-white text-sm outline-none flex-1"
            />
          </div>
        )}

        {/* Users */}
        {tab === 'users' && (
          <div className="card-glass rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--card-border)]">
                  {['ID', 'Игрок', 'Баланс', 'Игр', 'Статус', 'Дата', 'Действия'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-gray-500 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.filter(u => !searchQ || u.name.includes(searchQ)).map((u, i) => (
                  <tr key={u.id} className={`border-b border-[var(--card-border)] hover:bg-white/5 transition-colors ${i % 2 === 0 ? '' : 'bg-white/[0.02]'}`}>
                    <td className="px-4 py-3 text-gray-400">#{u.id}</td>
                    <td className="px-4 py-3 text-white font-medium">{u.name}</td>
                    <td className="px-4 py-3 text-[var(--neon-green)] font-semibold">{u.balance.toLocaleString('ru-RU')} ₽</td>
                    <td className="px-4 py-3 text-gray-400">{u.games}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-md text-xs font-semibold ${STATUS_COLORS[u.status] || ''}`}>
                        {u.status === 'active' ? 'Активен' : u.status === 'blocked' ? 'Заблокирован' : 'VIP'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{u.reg}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                          <Icon name="Edit" size={14} />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-[rgba(255,51,102,0.1)] text-gray-400 hover:text-[var(--neon-red)] transition-colors">
                          <Icon name="Ban" size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Deposits */}
        {tab === 'deposits' && (
          <div className="card-glass rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--card-border)]">
                  {['#', 'Игрок', 'Сумма', 'Метод', 'Время', 'Статус'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-gray-500 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {deposits.map((d, i) => (
                  <tr key={d.id} className={`border-b border-[var(--card-border)] hover:bg-white/5 transition-colors ${i % 2 === 0 ? '' : 'bg-white/[0.02]'}`}>
                    <td className="px-4 py-3 text-gray-500">{d.id}</td>
                    <td className="px-4 py-3 text-white">{d.user}</td>
                    <td className="px-4 py-3 text-[var(--neon-green)] font-semibold">+{d.amount.toLocaleString('ru-RU')} ₽</td>
                    <td className="px-4 py-3 text-gray-400">{d.method}</td>
                    <td className="px-4 py-3 text-gray-500">{d.time}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-md text-xs font-semibold ${STATUS_COLORS[d.status] || ''}`}>
                        {d.status === 'completed' ? 'Выполнено' : 'Ожидание'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Withdrawals */}
        {tab === 'withdrawals' && (
          <div className="card-glass rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--card-border)]">
                  {['#', 'Игрок', 'Сумма', 'Карта', 'Время', 'Статус', 'Действие'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-gray-500 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {withdrawals.map((w, i) => (
                  <tr key={w.id} className={`border-b border-[var(--card-border)] hover:bg-white/5 transition-colors ${i % 2 === 0 ? '' : 'bg-white/[0.02]'}`}>
                    <td className="px-4 py-3 text-gray-500">{w.id}</td>
                    <td className="px-4 py-3 text-white">{w.user}</td>
                    <td className="px-4 py-3 text-[var(--neon-red)] font-semibold">-{w.amount.toLocaleString('ru-RU')} ₽</td>
                    <td className="px-4 py-3 text-gray-400 font-mono">{w.card}</td>
                    <td className="px-4 py-3 text-gray-500">{w.time}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-md text-xs font-semibold ${STATUS_COLORS[w.status] || ''}`}>
                        {w.status === 'completed' ? 'Выполнено' : 'Ожидание'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {w.status === 'pending' && (
                        <div className="flex gap-1">
                          <button className="px-2 py-1 rounded-lg bg-[rgba(0,255,136,0.1)] text-[var(--neon-green)] text-xs font-semibold hover:bg-[rgba(0,255,136,0.2)] transition-all">
                            ✓ Одобрить
                          </button>
                          <button className="px-2 py-1 rounded-lg bg-[rgba(255,51,102,0.1)] text-[var(--neon-red)] text-xs font-semibold hover:bg-[rgba(255,51,102,0.2)] transition-all">
                            ✗
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Settings */}
        {tab === 'settings' && (
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { label: 'Комиссия платформы (%)', value: '5' },
              { label: 'Мин. депозит (₽)', value: '200' },
              { label: 'Мин. вывод (₽)', value: '500' },
              { label: 'Макс. вывод в день (₽)', value: '100000' },
              { label: 'Кэшбек (%)', value: '10' },
              { label: 'Бонус на первый депозит (%)', value: '100' },
            ].map(s => (
              <div key={s.label} className="card-glass rounded-xl p-4">
                <label className="text-gray-400 text-sm block mb-2">{s.label}</label>
                <div className="flex gap-2">
                  <input
                    defaultValue={s.value}
                    className="flex-1 bg-[var(--dark-bg)] border border-[var(--card-border)] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[var(--neon-orange)]"
                  />
                  <button className="px-3 py-2 rounded-lg btn-glow-orange text-white text-sm font-semibold">
                    <Icon name="Save" size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
