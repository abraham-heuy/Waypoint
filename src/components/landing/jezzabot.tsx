import { useState, useEffect } from 'react';
import Button from '../ui/Button';
import { Input } from '../ui/primitives';

type BotState = 'greeting' | 'prompt' | 'info' | 'chat';

const STORAGE_KEY = 'jezza_chat_state';

const INITIAL_MESSAGES = [
  { text: 'Hi, I am Jezza, I will be your guider.', delay: 500 },
  { text: 'I am not yet available, but once fully charged I will be of help!', delay: 2000 },
];

const INFO_MESSAGE = `
I am Jezza, your personal AI assistant for route planning and task management.

I can help you:
• Plan multi‑stop routes with real‑time traffic and road data
• Parse natural language into structured stops and time windows
• Suggest optimal stop orders and remind you of deadlines
• Integrate with your to‑do app to pull in tasks and turn them into routes
• Coordinate rideshare or delegate errands to team members
• Track your performance and suggest improvements

Once I am fully operational, I will be your co‑pilot for every journey.
`;

export default function JezzaBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ text: string; from: 'user' | 'bot' }>>([]);
  const [inputValue, setInputValue] = useState('');
  const [botState, setBotState] = useState<BotState>('greeting');
  const [typing, setTyping] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Load saved state from localStorage when the popup opens
  useEffect(() => {
    if (!isOpen) return;

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.messages && parsed.messages.length > 0) {
          setMessages(parsed.messages);
          setBotState(parsed.botState || 'chat');
          setHasInitialized(true);
          return;
        }
      } catch (_) {
        // ignore parse errors
      }
    }

    // No saved state – start the greeting flow
    setHasInitialized(false);
    setMessages([]);
    setBotState('greeting');
    setTyping(false);

    let timeouts: number[] = [];
    let accumulatedDelay = 0;

    INITIAL_MESSAGES.forEach((msg) => {
      const timeout = window.setTimeout(() => {
        setMessages((prev) => [...prev, { text: msg.text, from: 'bot' }]);
      }, accumulatedDelay + msg.delay);
      timeouts.push(timeout);
      accumulatedDelay += msg.delay + 600;
    });

    const promptTimeout = window.setTimeout(() => {
      setBotState('prompt');
    }, accumulatedDelay + 400);

    timeouts.push(promptTimeout);

    return () => timeouts.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Save state to localStorage whenever it changes (and popup is open)
  useEffect(() => {
    if (!isOpen) return;
    if (messages.length === 0 && botState === 'greeting') return;

    const stateToSave = {
      messages,
      botState,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
  }, [messages, botState, isOpen]);

  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  const handleQuickReply = () => {
    setMessages((prev) => [...prev, { text: 'Who am I?', from: 'user' }]);
    setBotState('info');
    setTyping(true);

    setTimeout(() => {
      setMessages((prev) => [...prev, { text: INFO_MESSAGE, from: 'bot' }]);
      setTyping(false);
      setBotState('chat');
    }, 1200);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    if (botState === 'prompt') {
      setMessages((prev) => [
        ...prev,
        { text: inputValue.trim(), from: 'user' },
        { text: 'Please click "Who am I?" to learn more about me, then I will be ready for your questions.', from: 'bot' },
      ]);
      setInputValue('');
      return;
    }

    const userMsg = inputValue.trim();
    setMessages((prev) => [...prev, { text: userMsg, from: 'user' }]);
    setInputValue('');
    setTyping(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          text: `Thanks for your message! I am still in development. Once I am fully charged, I will be able to help you with routing, reminders, and task management. Stay tuned!`,
          from: 'bot',
        },
      ]);
      setTyping(false);
    }, 1200);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 h-[500px] max-h-[calc(100vh-8rem)] rounded-2xl border border-dispatch-line bg-dispatch-panel shadow-2xl overflow-hidden animate-fade-up flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-dispatch-line bg-dispatch-accent/10 flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-dispatch-accent flex items-center justify-center text-[#1a1200] font-bold text-sm">
                J
              </div>
              <span className="font-semibold text-sm">Jezza Bot</span>
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
            </div>
            <button
              onClick={toggleOpen}
              className="text-dispatch-dim hover:text-dispatch-text transition-colors"
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 space-y-3 overflow-y-auto">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex items-start gap-2 animate-fade-up ${
                  msg.from === 'user' ? 'flex-row-reverse' : ''
                }`}
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {msg.from === 'bot' && (
                  <div className="w-7 h-7 rounded-full bg-dispatch-accent/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-dispatch-accent">J</span>
                  </div>
                )}
                <div
                  className={`rounded-xl px-3 py-2 text-sm max-w-[85%] whitespace-pre-wrap ${
                    msg.from === 'user'
                      ? 'bg-dispatch-accent text-[#1a1200]'
                      : 'bg-dispatch-panel2 border border-dispatch-line text-dispatch-text'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex items-start gap-2">
                <div className="w-7 h-7 rounded-full bg-dispatch-accent/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-dispatch-accent">J</span>
                </div>
                <div className="rounded-xl bg-dispatch-panel2 border border-dispatch-line px-3 py-2 text-sm text-dispatch-dim">
                  <span className="inline-flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-dispatch-dim animate-pulse" />
                    <span className="w-1.5 h-1.5 rounded-full bg-dispatch-dim animate-pulse [animation-delay:0.15s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-dispatch-dim animate-pulse [animation-delay:0.3s]" />
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Quick reply prompt */}
          {botState === 'prompt' && (
            <div className="px-4 pb-2 flex justify-start">
              <button
                onClick={handleQuickReply}
                className="px-4 py-2 rounded-full border border-dispatch-accent bg-dispatch-accent/10 text-dispatch-accent text-sm hover:bg-dispatch-accent hover:text-[#1a1200] transition-colors"
              >
                Who am I?
              </button>
            </div>
          )}

          {/* Input area */}
          <form
            onSubmit={handleSend}
            className="flex items-center gap-2 p-3 border-t border-dispatch-line flex-shrink-0 bg-dispatch-panel"
          >
            <Input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={
                botState === 'prompt'
                  ? 'Click "Who am I?" first'
                  : 'Type a message…'
              }
              className="flex-1 text-sm"
              disabled={botState === 'greeting'}
            />
            <Button
              type="submit"
              size="sm"
              disabled={!inputValue.trim() || botState === 'greeting'}
            >
              Send
            </Button>
          </form>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={toggleOpen}
        className={`relative w-14 h-14 rounded-full bg-dispatch-accent text-[#1a1200] flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 ${
          isOpen ? 'scale-90' : 'hover:scale-105'
        }`}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? (
          <span className="text-2xl font-light">✕</span>
        ) : (
          <div className="relative flex items-center justify-center w-full h-full">
            <span className="text-2xl font-bold">J</span>
            <span className="absolute inset-0 rounded-full border-2 border-dispatch-accent animate-ping opacity-30" />
          </div>
        )}
      </button>
    </div>
  );
}