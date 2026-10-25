import { useCallback, useEffect, useRef, useState } from 'react';
import { groupsApi } from '../../api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { timeText } from '../../utils/format';

const POLL_MS = 8000; // check for new messages every 8 seconds while the tab is open

export default function ChatTab({ group }) {
  const { user } = useAuth();
  const toast = useToast();
  const [messages, setMessages] = useState(null); // null = still loading
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const boxRef = useRef(null);

  const load = useCallback(async () => {
    try {
      setMessages((await groupsApi.messages(group.id)).messages);
      setError('');
    } catch (e) {
      setError(e.message);
    }
  }, [group.id]);

  useEffect(() => {
    load();
    const timer = setInterval(load, POLL_MS);
    return () => clearInterval(timer);
  }, [load]);

  // Keep the newest message in view.
  useEffect(() => {
    if (boxRef.current) boxRef.current.scrollTop = boxRef.current.scrollHeight;
  }, [messages]);

  const send = async (e) => {
    e.preventDefault();
    try {
      await groupsApi.sendMessage(group.id, text);
      setText('');
      await load();
    } catch (err) {
      toast(err.message, true);
    }
  };

  let content;
  if (error) content = error;
  else if (messages === null) content = 'Loading messages…';
  else if (!messages.length) {
    content = (
      <div className="empty" style={{ padding: 30 }}>
        No messages yet. Say hello 👋
      </div>
    );
  } else {
    content = messages.map((m) => (
      <div className={'chat-msg' + (m.userId === user.id ? ' mine' : '')} key={m.id}>
        <div className="chat-meta">
          {m.user?.name || 'Unknown'} · {timeText(m.createdAt)}
        </div>
        <div className="chat-bubble">{m.message}</div>
      </div>
    ));
  }

  return (
    <>
      <div className="chat-box" ref={boxRef}>
        {content}
      </div>
      <form className="chat-compose" onSubmit={send}>
        <input
          className="search-input"
          placeholder="Write a message to your group…"
          maxLength={1000}
          required
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button className="btn btn-primary">Send ↑</button>
      </form>
    </>
  );
}
