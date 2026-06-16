'use client';

import { useEffect, useRef, useState } from 'react';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: '안녕하세요! 무엇을 도와드릴까요? 🐾' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, open]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    const nextMessages: ChatMessage[] = [...messages, { role: 'user', content: text }];
    setMessages([...nextMessages, { role: 'assistant', content: '' }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages }),
      });

      if (!res.ok || !res.body) {
        throw new Error('Request failed');
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        assistantText += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: 'assistant', content: assistantText };
          return updated;
        });
      }
    } catch {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: 'assistant',
          content: '죄송해요, 잠시 문제가 생겼어요. 다시 시도해주세요.',
        };
        return updated;
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ position: 'fixed', bottom: 'clamp(12px, 4vw, 24px)', right: 'clamp(12px, 4vw, 24px)', zIndex: 1000, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {open && (
        <div
          style={{
            width: 'min(340px, calc(100vw - 24px))',
            height: 'min(460px, 72vh)',
            background: '#fff',
            border: '2.5px solid #111',
            borderRadius: '20px',
            boxShadow: '8px 8px 0 #FFDC20',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            marginBottom: '14px',
          }}
        >
          <div
            style={{
              background: '#0041BD',
              color: '#fff',
              padding: '16px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ fontWeight: 800, fontSize: '15px' }}>🐾 WAGGLE TAIL 상담</span>
            <button
              onClick={() => setOpen(false)}
              style={{ background: 'none', border: 'none', color: '#fff', fontSize: '18px', cursor: 'pointer' }}
              aria-label="닫기"
            >
              ✕
            </button>
          </div>

          <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                  background: m.role === 'user' ? '#0041BD' : '#f4f6fb',
                  color: m.role === 'user' ? '#fff' : '#111',
                  padding: '10px 14px',
                  borderRadius: '14px',
                  maxWidth: '80%',
                  fontSize: '14px',
                  lineHeight: 1.5,
                  whiteSpace: 'pre-wrap',
                }}
              >
                {m.content || (loading && i === messages.length - 1 ? '…' : '')}
              </div>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            style={{ display: 'flex', borderTop: '1px solid rgba(17,17,17,.14)', padding: '10px' }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="궁금한 점을 물어보세요"
              style={{ flex: 1, border: 'none', outline: 'none', fontSize: '14px', padding: '8px' }}
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              style={{
                background: '#FFDC20',
                border: '2px solid #111',
                borderRadius: '8px',
                padding: '8px 14px',
                fontWeight: 800,
                fontSize: '13px',
                cursor: loading ? 'default' : 'pointer',
                opacity: loading ? 0.6 : 1,
              }}
            >
              전송
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          width: '58px',
          height: '58px',
          borderRadius: '50%',
          background: '#0041BD',
          border: '2.5px solid #111',
          color: '#fff',
          fontSize: '26px',
          cursor: 'pointer',
          boxShadow: '0 4px 0 #111',
          float: 'right',
        }}
        aria-label="채팅 열기"
      >
        {open ? '✕' : '💬'}
      </button>
    </div>
  );
}
