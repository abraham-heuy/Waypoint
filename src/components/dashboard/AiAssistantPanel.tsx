import { useState, type FormEvent } from 'react';
import type { AiChatMessage, Stop } from '../../types';
import { sendAiChatMessage } from '../../lib/api';
import { Card } from '../ui/primitives';
import Button from '../ui/Button';
import { useAuthStore } from '../../store/authStore';
import { toast } from '../../store/toastStore';

const STARTER: AiChatMessage = {
  id: 'starter',
  role: 'assistant',
  content: "Tell me about your day — stops, deadlines, anything — and I'll turn it into a route.",
  createdAt: new Date().toISOString(),
};

interface AiAssistantPanelProps {
  /** Called when the person accepts a set of stops the assistant parsed
   * out of the conversation — the parent (RoutePlannerCard) is
   * responsible for merging these onto the map/route. */
  onStopsParsed?: (stops: Stop[]) => void;
  className?: string;
}

export default function AiAssistantPanel({ onStopsParsed, className = '' }: AiAssistantPanelProps) {
  const [messages, setMessages] = useState<AiChatMessage[]>([STARTER]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [acceptedIds, setAcceptedIds] = useState<Set<string>>(new Set());
  const user = useAuthStore((s) => s.user);
  const spendCredit = useAuthStore((s) => s.spendCredit);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || !user) return;

    if (user.credits <= 0) {
      toast.error('Out of credits — upgrade to keep using the assistant.');
      return;
    }

    const userMsg: AiChatMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: trimmed,
      createdAt: new Date().toISOString(),
    };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput('');
    setSending(true);

    const result = await sendAiChatMessage(user.id, trimmed, nextMessages);
    setSending(false);

    if (result.ok && result.data) {
      setMessages((prev) => [...prev, result.data as AiChatMessage]);
      spendCredit(1);
    } else {
      toast.error('The assistant is unavailable right now. Try again shortly.');
    }
  }

  function handleAccept(message: AiChatMessage) {
    if (!message.parsedStops) return;
    onStopsParsed?.(message.parsedStops);
    setAcceptedIds((prev) => new Set(prev).add(message.id));
    toast.success(`Added ${message.parsedStops.length} stop${message.parsedStops.length === 1 ? '' : 's'} to the map.`);
  }

  return (
    <Card className={`p-5 flex flex-col h-[420px] ${className}`}>
      <h3 className="text-sm font-semibold mb-3">Planning assistant</h3>
      <div className="flex-1 overflow-y-auto space-y-3 mb-3 pr-1">
        {messages.map((m) => (
          <div key={m.id} className={m.role === 'user' ? 'flex justify-end' : ''}>
            <div
              className={`text-xs leading-relaxed rounded-lg px-3 py-2.5 max-w-[85%] ${
                m.role === 'user' ? 'bg-dispatch-accent text-[#1a1200]' : 'bg-dispatch-panel2 text-dispatch-dim'
              }`}
            >
              {m.content}
              {m.parsedStops && m.parsedStops.length > 0 && (
                <div className="mt-2.5 pt-2.5 border-t border-dispatch-line/50">
                  <ul className="space-y-1 mb-2.5">
                    {m.parsedStops.map((s) => (
                      <li key={s.id} className="flex items-center gap-1.5 text-[11px] text-dispatch-text">
                        <span className="w-1 h-1 rounded-full bg-dispatch-accent flex-shrink-0" />
                        {s.label}
                        {s.windowEnd && <span className="text-dispatch-dim">· by {s.windowEnd}</span>}
                      </li>
                    ))}
                  </ul>
                  <Button
                    size="sm"
                    variant={acceptedIds.has(m.id) ? 'secondary' : 'primary'}
                    disabled={acceptedIds.has(m.id)}
                    onClick={() => handleAccept(m)}
                  >
                    {acceptedIds.has(m.id) ? 'Added to map' : 'Add to map'}
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
        {sending && (
          <div className="bg-dispatch-panel2 text-dispatch-dim text-xs rounded-lg px-3 py-2.5 max-w-[60%] flex gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-dispatch-dim animate-pulse" />
            <span className="w-1.5 h-1.5 rounded-full bg-dispatch-dim animate-pulse [animation-delay:0.15s]" />
            <span className="w-1.5 h-1.5 rounded-full bg-dispatch-dim animate-pulse [animation-delay:0.3s]" />
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. pharmacy, then groceries, then pick up Sam by 4"
          className="flex-1 rounded-lg bg-dispatch-panel2 border border-dispatch-line px-3 py-2 text-xs outline-none focus:border-dispatch-accent"
        />
        <Button type="submit" size="sm" loading={sending} disabled={!input.trim()}>
          Send
        </Button>
      </form>
    </Card>
  );
}
