import { useState, useEffect, useRef } from 'react';
import Icon from '@/components/ui/icon';

interface AviatrixPageProps {
  balance: number;
  onBalanceChange: (amount: number) => void;
  isLoggedIn: boolean;
  onLogin: () => void;
}

type GameState = 'waiting' | 'flying' | 'crashed' | 'cashedOut';

const recentRounds = [1.23, 4.56, 1.01, 12.40, 2.87, 1.55, 33.21, 1.08, 7.62, 2.01, 1.43, 88.5, 1.12];

export default function AviatrixPage({ balance, onBalanceChange, isLoggedIn, onLogin }: AviatrixPageProps) {
  const [betAmount, setBetAmount] = useState(100);
  const [autoOut, setAutoOut] = useState<number | ''>('');
  const [gameState, setGameState] = useState<GameState>('waiting');
  const [multiplier, setMultiplier] = useState(1.00);
  const [betPlaced, setBetPlaced] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [crashPoint, setCrashPoint] = useState(0);
  const [winAmount, setWinAmount] = useState<number | null>(null);
  const [history, setHistory] = useState(recentRounds);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const generateCrashPoint = (): number => {
    const r = Math.random();
    if (r < 0.3) return parseFloat((1 + Math.random() * 0.5).toFixed(2));
    if (r < 0.7) return parseFloat((1.5 + Math.random() * 5).toFixed(2));
    if (r < 0.9) return parseFloat((6 + Math.random() * 20).toFixed(2));
    return parseFloat((26 + Math.random() * 74).toFixed(2));
  };

  const startCountdown = () => {
    setGameState('waiting');
    setMultiplier(1.00);
    setCountdown(5);
    setBetPlaced(false);
    setWinAmount(null);

    countdownRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownRef.current!);
          startFlight();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startFlight = () => {
    const cp = generateCrashPoint();
    setCrashPoint(cp);
    setGameState('flying');
    let current = 1.00;

    intervalRef.current = setInterval(() => {
      current = parseFloat((current + current * 0.03 * (1 + Math.random() * 0.1)).toFixed(2));
      setMultiplier(current);

      if (current >= cp) {
        clearInterval(intervalRef.current!);
        setGameState('crashed');
        setHistory(prev => [cp, ...prev.slice(0, 12)]);
        setTimeout(startCountdown, 3000);
      }
    }, 100);
  };

  useEffect(() => {
    startCountdown();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  useEffect(() => {
    if (gameState === 'flying' && betPlaced && autoOut && multiplier >= Number(autoOut)) {
      handleCashOut();
    }
  }, [multiplier, gameState, betPlaced, autoOut]);

  const placeBet = () => {
    if (!isLoggedIn) { onLogin(); return; }
    if (betAmount > balance || gameState !== 'waiting') return;
    onBalanceChange(-betAmount);
    setBetPlaced(true);
  };

  const handleCashOut = () => {
    if (gameState !== 'flying' || !betPlaced) return;
    const win = parseFloat((betAmount * multiplier).toFixed(2));
    onBalanceChange(win);
    setWinAmount(win);
    setGameState('cashedOut');
    setBetPlaced(false);
  };

  const getMultiplierColor = () => {
    if (gameState === 'crashed') return 'text-[var(--neon-red)]';
    if (multiplier >= 10) return 'text-[var(--neon-green)]';
    if (multiplier >= 3) return 'text-[var(--neon-orange)]';
    return 'text-white';
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl font-bold text-white mb-2">
            АВИАТРИКС <span className="neon-red">✈</span>
          </h1>
          <p className="text-gray-400">Самолёт взлетает — забери деньги до крушения!</p>
        </div>

        {/* History */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-thin">
          {history.map((val, i) => (
            <span
              key={i}
              className={`flex-shrink-0 px-2.5 py-1 rounded-lg text-xs font-bold ${
                val < 1.5 ? 'bg-[rgba(255,51,102,0.15)] text-[var(--neon-red)]' :
                val < 5 ? 'bg-[rgba(255,140,0,0.15)] text-[var(--neon-orange)]' :
                'bg-[rgba(0,255,136,0.15)] text-[var(--neon-green)]'
              }`}
            >
              {val}×
            </span>
          ))}
        </div>

        <div className="grid lg:grid-cols-[340px_1fr] gap-6">
          {/* Controls */}
          <div className="space-y-4">
            <div className="card-glass rounded-2xl p-5">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <Icon name="Coins" size={16} className="text-[var(--neon-orange)]" />
                Ставка
              </h3>
              <div className="flex items-center gap-2 mb-3">
                <input
                  type="number"
                  value={betAmount}
                  onChange={e => setBetAmount(Math.max(10, parseInt(e.target.value) || 10))}
                  disabled={betPlaced || gameState === 'flying'}
                  className="flex-1 bg-[var(--dark-bg)] border border-[var(--card-border)] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[var(--neon-orange)]"
                />
                <span className="text-gray-400 text-sm">₽</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {[50, 100, 500, 1000].map(amt => (
                  <button
                    key={amt}
                    onClick={() => setBetAmount(amt)}
                    disabled={betPlaced || gameState === 'flying'}
                    className="py-1.5 rounded-lg text-xs font-semibold bg-[var(--card-border)] text-gray-400 hover:text-white hover:bg-[rgba(255,140,0,0.1)] transition-all disabled:opacity-40"
                  >
                    {amt}
                  </button>
                ))}
              </div>
            </div>

            <div className="card-glass rounded-2xl p-5">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <Icon name="Target" size={16} className="text-[var(--neon-cyan)]" />
                Авто-вывод
              </h3>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Напр. 2.00"
                  value={autoOut}
                  onChange={e => setAutoOut(e.target.value ? parseFloat(e.target.value) : '')}
                  className="flex-1 bg-[var(--dark-bg)] border border-[var(--card-border)] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[var(--neon-cyan)]"
                />
                <span className="text-gray-400 text-sm">×</span>
              </div>
              <p className="text-gray-500 text-xs mt-2">Автоматически заберёт при достижении коэффициента</p>
            </div>

            <div className="card-glass rounded-2xl p-5">
              {gameState === 'waiting' && (
                <>
                  <div className="text-center mb-4">
                    <p className="text-gray-400 text-sm mb-1">Следующий раунд через</p>
                    <p className="font-display text-4xl font-bold text-[var(--neon-cyan)]">{countdown}с</p>
                  </div>
                  {!betPlaced ? (
                    <button
                      onClick={placeBet}
                      disabled={betAmount > balance && isLoggedIn}
                      className="w-full py-3 rounded-xl btn-glow-orange text-white font-display font-bold text-lg"
                    >
                      {!isLoggedIn ? 'Войти' : 'ПОСТАВИТЬ'}
                    </button>
                  ) : (
                    <div className="w-full py-3 rounded-xl text-center bg-[rgba(0,255,136,0.1)] border border-[rgba(0,255,136,0.3)] text-[var(--neon-green)] font-bold">
                      ✓ Ставка принята: {betAmount} ₽
                    </div>
                  )}
                </>
              )}

              {gameState === 'flying' && (
                <>
                  {betPlaced ? (
                    <>
                      <div className="text-center mb-4">
                        <p className="text-gray-400 text-sm">Потенциальный выигрыш</p>
                        <p className="font-display text-2xl font-bold text-[var(--neon-green)]">
                          {(betAmount * multiplier).toFixed(2)} ₽
                        </p>
                      </div>
                      <button onClick={handleCashOut} className="w-full py-3 rounded-xl btn-glow-cyan text-white font-display font-bold text-lg">
                        ЗАБРАТЬ {(betAmount * multiplier).toFixed(2)} ₽
                      </button>
                    </>
                  ) : (
                    <div className="text-center text-gray-500 text-sm py-2">Раунд в процессе</div>
                  )}
                </>
              )}

              {gameState === 'crashed' && (
                <div className="text-center">
                  <p className="text-[var(--neon-red)] font-display text-xl font-bold">💥 Крушение!</p>
                  <p className="text-gray-400 text-sm mt-1">Новый раунд начнётся скоро</p>
                </div>
              )}

              {gameState === 'cashedOut' && winAmount && (
                <div className="text-center">
                  <p className="text-[var(--neon-green)] font-display text-xl font-bold">✅ Забрал {winAmount.toLocaleString('ru-RU')} ₽</p>
                  <p className="text-gray-400 text-sm mt-1">Жди следующего раунда</p>
                </div>
              )}
            </div>
          </div>

          {/* Game Display */}
          <div className="card-glass rounded-2xl overflow-hidden relative" style={{ minHeight: '400px' }}>
            <img
              src="https://cdn.poehali.dev/projects/81c22ef3-a9dd-47b9-9a80-99e87794b370/files/dc41146a-86bc-45a2-b16f-24493aea371d.jpg"
              alt="Авиатрикс"
              className="absolute inset-0 w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {gameState === 'waiting' && (
                <div className="text-center">
                  <div className="text-6xl mb-4 animate-float">✈️</div>
                  <p className="text-gray-400 font-display text-xl">Ожидание раунда...</p>
                  <p className="text-[var(--neon-cyan)] text-4xl font-display font-bold mt-2">{countdown}с</p>
                </div>
              )}

              {(gameState === 'flying' || gameState === 'cashedOut') && (
                <div className="text-center">
                  <div className={`text-8xl font-display font-black tracking-tight ${getMultiplierColor()}`}
                    style={{ textShadow: `0 0 40px currentColor` }}>
                    {multiplier.toFixed(2)}×
                  </div>
                  <div className="text-5xl mt-2 animate-float">✈️</div>
                  {gameState === 'cashedOut' && (
                    <div className="mt-4 px-4 py-2 rounded-xl bg-[rgba(0,255,136,0.2)] border border-[rgba(0,255,136,0.4)] text-[var(--neon-green)] font-bold">
                      Вылетел на {multiplier.toFixed(2)}×
                    </div>
                  )}
                </div>
              )}

              {gameState === 'crashed' && (
                <div className="text-center">
                  <div className="text-8xl mb-4">💥</div>
                  <div className="text-6xl font-display font-black text-[var(--neon-red)]"
                    style={{ textShadow: '0 0 40px var(--neon-red)' }}>
                    {crashPoint.toFixed(2)}×
                  </div>
                  <p className="text-gray-400 mt-2 font-display text-xl">КРУШЕНИЕ</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
