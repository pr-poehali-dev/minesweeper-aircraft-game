import { useState, useRef, useEffect } from 'react';
import Icon from '@/components/ui/icon';

interface Message {
  id: number;
  text: string;
  from: 'user' | 'support';
  time: string;
}

const getTime = () => new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

const AUTO_REPLIES = [
  'Здравствуйте! Я помогу вам. Опишите вашу проблему подробнее.',
  'Понял вас. Проверяю информацию, одну минуту...',
  'Готово! Если возникнут ещё вопросы — обращайтесь. Мы работаем 24/7.',
  'Конечно, помогу разобраться! Уточните пожалуйста детали.',
  'Ваш запрос принят. Ожидайте ответа специалиста в течение 2-3 минут.',
];

const INIT_MSGS: Message[] = [
  { id: 1, text: 'Добро пожаловать в поддержку NEXUS! Чем могу помочь? 👋', from: 'support', time: '14:00' },
];

export default function SupportPage({ isLoggedIn, onLogin }: { isLoggedIn: boolean; onLogin: () => void }) {
  const [messages, setMessages] = useState<Message[]>(INIT_MSGS);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [replyIdx, setReplyIdx] = useState(0);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = () => {
    if (!input.trim()) return;
    if (!isLoggedIn) { onLogin(); return; }

    const userMsg: Message = { id: Date.now(), text: input.trim(), from: 'user', time: getTime() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const reply = AUTO_REPLIES[replyIdx % AUTO_REPLIES.length];
      setMessages(prev => [...prev, { id: Date.now() + 1, text: reply, from: 'support', time: getTime() }]);
      setIsTyping(false);
      setReplyIdx(prev => prev + 1);
    }, 1500 + Math.random() * 1000);
  };

  const quickQuestions = [
    'Как пополнить баланс?',
    'Когда придёт вывод?',
    'Как работает кэшбек?',
    'Проблема с игрой',
  ];

  return (
    <div className="min-h-screen pt-24 pb-6">
      <div className="max-w-2xl mx-auto px-4 h-[calc(100vh-120px)] flex flex-col">
        {/* Header */}
        <div className="card-glass rounded-t-2xl p-4 flex items-center gap-3 border-b border-[var(--card-border)]">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--neon-orange)] to-[#FF5500] flex items-center justify-center text-white font-bold">N</div>
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[var(--neon-green)] border-2 border-[#111520]" />
          </div>
          <div>
            <p className="text-white font-semibold">Поддержка NEXUS</p>
            <p className="text-[var(--neon-green)] text-xs">● Онлайн · Отвечаем за 2 мин</p>
          </div>
          <div className="ml-auto">
            <Icon name="Shield" size={18} className="text-[var(--neon-orange)]" />
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[rgba(10,12,18,0.7)] scrollbar-thin">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.from === 'support' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--neon-orange)] to-[#FF5500] flex items-center justify-center text-white text-xs font-bold mr-2 flex-shrink-0 mt-1">
                  N
                </div>
              )}
              <div className={`max-w-[75%] ${msg.from === 'user' ? 'chat-bubble-user' : 'chat-bubble-support'} px-4 py-2.5`}>
                <p className="text-white text-sm">{msg.text}</p>
                <p className={`text-xs mt-1 ${msg.from === 'user' ? 'text-white/60' : 'text-gray-500'}`}>{msg.time}</p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--neon-orange)] to-[#FF5500] flex items-center justify-center text-white text-xs font-bold">N</div>
              <div className="chat-bubble-support px-4 py-3 flex gap-1.5">
                {[0, 1, 2].map(i => (
                  <span key={i} className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Quick questions */}
        {messages.length <= 2 && (
          <div className="bg-[rgba(10,12,18,0.7)] px-4 pb-2 flex gap-2 overflow-x-auto scrollbar-thin">
            {quickQuestions.map(q => (
              <button
                key={q}
                onClick={() => setInput(q)}
                className="flex-shrink-0 px-3 py-1.5 rounded-full border border-[rgba(255,140,0,0.3)] text-[var(--neon-orange)] text-xs hover:bg-[rgba(255,140,0,0.1)] transition-all"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="card-glass rounded-b-2xl p-4 border-t border-[var(--card-border)]">
          <div className="flex gap-3 items-end">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder={isLoggedIn ? 'Напишите сообщение...' : 'Войдите, чтобы написать в чат'}
              rows={1}
              className="flex-1 bg-[var(--dark-bg)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[var(--neon-orange)] resize-none"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              className="w-11 h-11 rounded-xl btn-glow-orange flex items-center justify-center flex-shrink-0 disabled:opacity-50"
            >
              <Icon name="Send" size={18} className="text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
