import { useState, useCallback } from 'react';
import Icon from '@/components/ui/icon';

interface MinerPageProps {
  balance: number;
  onBalanceChange: (amount: number) => void;
  isLoggedIn: boolean;
  onLogin: () => void;
}

const GRID_SIZE = 25;

const MINE_OPTIONS = [1, 3, 5, 10, 15, 20];

const getMultiplier = (opened: number, mines: number): number => {
  const safe = GRID_SIZE - mines;
  if (opened === 0) return 1;
  let mult = 1;
  for (let i = 0; i < opened; i++) {
    mult *= (GRID_SIZE - mines - i) / (GRID_SIZE - i);
  }
  return Math.max(1.01, parseFloat((1 / mult * 0.95).toFixed(2)));
};

type CellState = 'hidden' | 'gem' | 'bomb';

export default function MinerPage({ balance, onBalanceChange, isLoggedIn, onLogin }: MinerPageProps) {
  const [minesCount, setMinesCount] = useState(5);
  const [betAmount, setBetAmount] = useState(100);
  const [cells, setCells] = useState<CellState[]>(Array(GRID_SIZE).fill('hidden'));
  const [minePositions, setMinePositions] = useState<Set<number>>(new Set());
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'won' | 'lost'>('idle');
  const [openedCount, setOpenedCount] = useState(0);
  const [lastWin, setLastWin] = useState<number | null>(null);

  const multiplier = getMultiplier(openedCount, minesCount);
  const potentialWin = parseFloat((betAmount * multiplier).toFixed(2));

  const startGame = useCallback(() => {
    if (!isLoggedIn) { onLogin(); return; }
    if (betAmount > balance) return;
    if (betAmount < 10) return;

    onBalanceChange(-betAmount);

    const positions = new Set<number>();
    while (positions.size < minesCount) {
      positions.add(Math.floor(Math.random() * GRID_SIZE));
    }
    setMinePositions(positions);
    setCells(Array(GRID_SIZE).fill('hidden'));
    setGameState('playing');
    setOpenedCount(0);
    setLastWin(null);
  }, [betAmount, balance, minesCount, isLoggedIn, onLogin, onBalanceChange]);

  const openCell = useCallback((index: number) => {
    if (gameState !== 'playing' || cells[index] !== 'hidden') return;

    const isBomb = minePositions.has(index);
    const newCells = [...cells];

    if (isBomb) {
      minePositions.forEach(pos => { newCells[pos] = 'bomb'; });
      setCells(newCells);
      setGameState('lost');
    } else {
      newCells[index] = 'gem';
      setCells(newCells);
      const newOpened = openedCount + 1;
      setOpenedCount(newOpened);

      if (newOpened === GRID_SIZE - minesCount) {
        const win = parseFloat((betAmount * getMultiplier(newOpened, minesCount)).toFixed(2));
        onBalanceChange(win);
        setLastWin(win);
        setGameState('won');
      }
    }
  }, [gameState, cells, minePositions, openedCount, betAmount, minesCount, onBalanceChange]);

  const cashOut = useCallback(() => {
    if (gameState !== 'playing' || openedCount === 0) return;
    const win = parseFloat((betAmount * multiplier).toFixed(2));
    onBalanceChange(win);
    setLastWin(win);
    setGameState('won');
    const newCells = [...cells];
    minePositions.forEach(pos => { newCells[pos] = 'bomb'; });
    setCells(newCells);
  }, [gameState, openedCount, betAmount, multiplier, cells, minePositions, onBalanceChange]);

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl font-bold text-white mb-2">
            МАЙНЕР <span className="neon-orange">5×5</span>
          </h1>
          <p className="text-gray-400">Открывай клетки и собирай кристаллы. Не задень мины!</p>
        </div>

        <div className="grid lg:grid-cols-[340px_1fr] gap-6">
          {/* Controls */}
          <div className="space-y-4">
            <div className="card-glass rounded-2xl p-5">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <Icon name="Bomb" size={16} className="text-[var(--neon-red)]" />
                Количество мин
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {MINE_OPTIONS.map(n => (
                  <button
                    key={n}
                    onClick={() => gameState === 'idle' && setMinesCount(n)}
                    disabled={gameState === 'playing'}
                    className={`py-2 rounded-lg text-sm font-bold transition-all ${
                      minesCount === n
                        ? 'btn-glow-orange text-white'
                        : 'bg-[var(--card-border)] text-gray-400 hover:text-white hover:bg-[rgba(255,140,0,0.1)]'
                    }`}
                  >
                    {n} 💣
                  </button>
                ))}
              </div>
            </div>

            <div className="card-glass rounded-2xl p-5">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <Icon name="Coins" size={16} className="text-[var(--neon-orange)]" />
                Ставка
              </h3>
              <div className="flex items-center gap-2 mb-3">
                <input
                  type="number"
                  value={betAmount}
                  onChange={e => gameState === 'idle' && setBetAmount(Math.max(10, parseInt(e.target.value) || 10))}
                  disabled={gameState === 'playing'}
                  className="flex-1 bg-[var(--dark-bg)] border border-[var(--card-border)] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[var(--neon-orange)]"
                />
                <span className="text-gray-400 text-sm">₽</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {[50, 100, 500, 1000].map(amt => (
                  <button
                    key={amt}
                    onClick={() => gameState === 'idle' && setBetAmount(amt)}
                    disabled={gameState === 'playing'}
                    className="py-1.5 rounded-lg text-xs font-semibold bg-[var(--card-border)] text-gray-400 hover:text-white hover:bg-[rgba(255,140,0,0.1)] transition-all"
                  >
                    {amt}
                  </button>
                ))}
              </div>
            </div>

            <div className="card-glass rounded-2xl p-5">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400 text-sm">Коэффициент</span>
                <span className="font-display text-2xl font-bold neon-orange">{multiplier}×</span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-400 text-sm">Выигрыш</span>
                <span className="font-display text-xl font-bold text-[var(--neon-green)]">{potentialWin.toLocaleString('ru-RU')} ₽</span>
              </div>

              {gameState === 'idle' || gameState === 'won' || gameState === 'lost' ? (
                <button
                  onClick={startGame}
                  className="w-full py-3 rounded-xl btn-glow-orange text-white font-display font-bold text-lg"
                  disabled={betAmount > balance && isLoggedIn}
                >
                  {!isLoggedIn ? 'Войти и играть' : betAmount > balance ? 'Недостаточно средств' : 'ИГРАТЬ'}
                </button>
              ) : (
                <button
                  onClick={cashOut}
                  disabled={openedCount === 0}
                  className="w-full py-3 rounded-xl btn-glow-cyan text-white font-display font-bold text-lg disabled:opacity-50"
                >
                  ЗАБРАТЬ {(betAmount * multiplier).toFixed(2)} ₽
                </button>
              )}
            </div>

            {lastWin !== null && (
              <div className={`rounded-2xl p-4 text-center ${gameState === 'won' ? 'bg-[rgba(0,255,136,0.1)] border border-[rgba(0,255,136,0.3)]' : 'bg-[rgba(255,51,102,0.1)] border border-[rgba(255,51,102,0.3)]'}`}>
                {gameState === 'won' ? (
                  <>
                    <div className="text-2xl mb-1">🎉</div>
                    <p className="text-[var(--neon-green)] font-display font-bold text-xl">+{lastWin.toLocaleString('ru-RU')} ₽</p>
                    <p className="text-gray-400 text-sm">Отличная игра!</p>
                  </>
                ) : (
                  <>
                    <div className="text-2xl mb-1">💥</div>
                    <p className="text-[var(--neon-red)] font-display font-bold text-xl">Мина!</p>
                    <p className="text-gray-400 text-sm">Попробуй ещё раз</p>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Game Grid */}
          <div className="card-glass rounded-2xl p-5">
            <div className="grid grid-cols-5 gap-2 max-w-sm mx-auto">
              {cells.map((cell, i) => (
                <button
                  key={i}
                  onClick={() => openCell(i)}
                  className={`aspect-square rounded-xl text-2xl flex items-center justify-center transition-all ${
                    cell === 'hidden'
                      ? 'miner-cell'
                      : cell === 'gem'
                      ? 'miner-cell revealed-gem'
                      : 'miner-cell revealed-bomb'
                  }`}
                >
                  {cell === 'gem' && '💎'}
                  {cell === 'bomb' && '💣'}
                </button>
              ))}
            </div>

            {gameState === 'idle' && (
              <div className="mt-6 text-center text-gray-500 text-sm">
                Настрой ставку и нажми «ИГРАТЬ»
              </div>
            )}

            {gameState === 'playing' && (
              <div className="mt-6 flex justify-center gap-6 text-sm">
                <div className="text-center">
                  <p className="text-gray-400">Открыто</p>
                  <p className="text-white font-bold text-lg">{openedCount} / {GRID_SIZE - minesCount}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400">Мин осталось</p>
                  <p className="text-[var(--neon-red)] font-bold text-lg">{minesCount} 💣</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
