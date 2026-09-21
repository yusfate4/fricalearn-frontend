import React, { useEffect, useState, useRef, useCallback } from "react";
import api from "../../api/axios";
import { AdminShell } from "../../components/admin/AdminShell";
import { MessageSquare, Send, Loader2, RefreshCw, Circle, User } from "lucide-react";

export default function AdminChatList() {
  const [convos, setConvos]     = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [reply, setReply]       = useState("");
  const [loading, setLoading]   = useState(true);
  const [sending, setSending]   = useState(false);
  const [polling, setPolling]   = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const fetchConvos = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await api.get("/admin/chats");
      setConvos(Array.isArray(res.data) ? res.data : []);
    } catch(e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  const fetchMessages = useCallback(async (id: number) => {
    try {
      const res = await api.get(`/admin/conversations/${id}/messages`);
      setMessages(Array.isArray(res.data) ? res.data : []);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch(e) { console.error(e); }
  }, []);

  useEffect(() => { fetchConvos(); }, [fetchConvos]);

  // Poll for new messages every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchConvos(true);
      if (selected) fetchMessages(selected.id);
    }, 15000);
    return () => clearInterval(interval);
  }, [selected, fetchConvos, fetchMessages]);

  const openConvo = async (c: any) => {
    setSelected(c);
    await fetchMessages(c.id);
    // Mark as read
    setConvos(prev => prev.map(x => x.id === c.id ? { ...x, unread_count: 0 } : x));
  };

  const sendReply = async () => {
    if (!reply.trim() || !selected) return;
    setSending(true);
    try {
      await api.post(`/admin/conversations/${selected.id}/reply`, { message: reply });
      setReply("");
      await fetchMessages(selected.id);
      fetchConvos(true);
    } catch(e) { console.error(e); }
    finally { setSending(false); }
  };

  const totalUnread = convos.reduce((s, c) => s + (c.unread_count || 0), 0);

  return (
    <AdminShell title="Support Chat">
      <div className="h-[calc(100vh-10rem)] flex gap-4">

        {/* ── Conversation list ─── */}
        <div className="w-72 shrink-0 bg-white border-2 border-gray-100 rounded-2xl flex flex-col overflow-hidden">
          <div className="px-4 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="font-black text-gray-800 text-sm uppercase tracking-tight">Inbox</h3>
              {totalUnread > 0 && (
                <p className="text-[9px] font-black text-[#3F2171] uppercase">{totalUnread} unread</p>
              )}
            </div>
            <button onClick={() => fetchConvos()} className="p-2 rounded-xl hover:bg-gray-100">
              <RefreshCw size={14} className="text-gray-400"/>
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center flex-1"><Loader2 className="animate-spin text-[#3F2171]" size={24}/></div>
          ) : convos.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-8">
              <MessageSquare size={32} className="text-gray-200 mb-3"/>
              <p className="font-black text-gray-400 text-sm uppercase italic">No conversations yet</p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
              {convos.map(c => (
                <button key={c.id} onClick={() => openConvo(c)}
                  className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-start gap-3 ${selected?.id === c.id ? "bg-[#3F2171]/5 border-l-4 border-l-[#3F2171]" : ""}`}>
                  <div className="w-9 h-9 bg-[#3F2171]/10 rounded-xl flex items-center justify-center text-[#3F2171] font-black text-sm shrink-0 mt-0.5">
                    {(c.display_name || "?")[0].toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-black text-sm text-gray-700 truncate">{c.display_name}</p>
                      {c.unread_count > 0 && (
                        <span className="bg-[#3F2171] text-white text-[8px] font-black px-1.5 py-0.5 rounded-full shrink-0 ml-1">{c.unread_count}</span>
                      )}
                    </div>
                    <p className="text-[10px] text-gray-400 truncate font-bold">{c.last_message}</p>
                    <p className="text-[9px] text-gray-300 font-bold mt-0.5">{c.updated_at}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Message pane ─── */}
        <div className="flex-1 bg-white border-2 border-gray-100 rounded-2xl flex flex-col overflow-hidden">
          {!selected ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
              <MessageSquare size={48} className="text-gray-200 mb-4"/>
              <h3 className="font-black text-gray-500 uppercase italic text-lg">Select a conversation</h3>
              <p className="text-gray-400 font-bold text-sm mt-2">Messages are stored permanently — nothing is lost when you're offline</p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
                <div className="w-9 h-9 bg-[#3F2171] rounded-xl flex items-center justify-center text-[#FFFF00] font-black">
                  {(selected.display_name || "?")[0].toUpperCase()}
                </div>
                <div>
                  <p className="font-black text-gray-800">{selected.display_name}</p>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                    <Circle size={6} className="text-green-400 fill-green-400"/> Auto-email reply when offline enabled
                  </p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((m: any) => {
                  const isAdmin = m.sender?.role === "admin" || m.sender?.is_admin;
                  return (
                    <div key={m.id} className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                        isAdmin ? "bg-[#3F2171] text-white" : "bg-gray-100 text-gray-700"
                      }`}>
                        <p className="text-sm font-medium leading-relaxed">{m.message}</p>
                        <p className={`text-[9px] font-bold mt-1 ${isAdmin ? "text-white/50" : "text-gray-400"}`}>
                          {new Date(m.created_at).toLocaleString("en-GB",{hour:"2-digit",minute:"2-digit",day:"numeric",month:"short"})}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef}/>
              </div>

              {/* Reply box */}
              <div className="px-4 py-4 border-t border-gray-100">
                <div className="flex gap-3">
                  <textarea value={reply} onChange={e => setReply(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendReply(); }}}
                    placeholder="Type your reply… (Enter to send, Shift+Enter for new line)"
                    rows={2}
                    className="flex-1 bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#3F2171] resize-none transition-colors"/>
                  <button onClick={sendReply} disabled={!reply.trim() || sending}
                    className="w-12 h-12 self-end bg-[#3F2171] text-white rounded-2xl flex items-center justify-center hover:bg-black transition-all disabled:opacity-40 shrink-0">
                    {sending ? <Loader2 size={16} className="animate-spin"/> : <Send size={16}/>}
                  </button>
                </div>
                <p className="text-[9px] text-gray-300 font-bold mt-2">Reply also sends an email to the parent so they never miss a response</p>
              </div>
            </>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
