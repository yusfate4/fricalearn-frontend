import React, { useState, useEffect, useRef } from "react";
import api from "../../api/axios";
import Layout from "../../components/Layout";
import {
  Send, ShieldCheck, Loader2, Image as ImageIcon,
  Mic, Square, Trash2, X, Headphones, LifeBuoy, User,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export default function ParentMessages() {
  const { user } = useAuth();
  const [messages, setMessages]   = useState<any[]>([]);
  const [loading, setLoading]     = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const scrollRef  = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const notificationSound = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    notificationSound.current = new Audio("/sounds/notification.mp3");
    notificationSound.current.load();
  }, []);

  const playNotification = () => {
    if (notificationSound.current) {
      notificationSound.current.currentTime = 0;
      notificationSound.current.play().catch(() => {});
    }
  };

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview,  setImagePreview]  = useState<string | null>(null);
  const [isRecording,   setIsRecording]   = useState(false);
  const [selectedAudio, setSelectedAudio] = useState<File | null>(null);
  const [audioPreview,  setAudioPreview]  = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef   = useRef<Blob[]>([]);

  const getMediaUrl = (path: string) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `https://res.cloudinary.com/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/all/upload/${path}`;
  };

  const showBrowserNotification = (body: string) => {
    if (!("Notification" in window)) return;
    if (Notification.permission === "granted") {
      new Notification("FricaLearn Support", { body, icon: "/logo192.png" });
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission();
    }
  };

  const fetchMessages = async () => {
    if (!user?.id) return;
    try {
      const res = await api.get(`/chat/conversation?participant_id=${user.id}&t=${Date.now()}`);
      if (res.data?.messages) {
        const incoming = res.data.messages;
        if (incoming.length > messages.length) {
          const last = incoming[incoming.length - 1];
          if (messages.length > 0 && Number(last.sender_id) !== Number(user.id)) {
            playNotification();
            showBrowserNotification(last.message || "New message from FricaLearn Admin");
          }
          setMessages(incoming);
        }
      }
    } catch (err) {
      console.error("Support desk sync failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [user?.id, messages.length]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!newMessage.trim() && !selectedImage && !selectedAudio) || isSending || isRecording) return;
    setIsSending(true);
    const fd = new FormData();
    fd.append("receiver_id", "2");
    if (newMessage.trim()) fd.append("message", newMessage);
    if (selectedImage)     fd.append("image", selectedImage);
    if (selectedAudio)     fd.append("audio", selectedAudio);
    try {
      const res = await api.post("/chat/message", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setMessages(prev => [...prev, res.data]);
      setNewMessage("");
      setSelectedImage(null); setImagePreview(null);
      setSelectedAudio(null); setAudioPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch {
      setError("Delivery failed. Try again.");
      setTimeout(() => setError(null), 4000);
    } finally {
      setIsSending(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const startRecording = async () => {
    try {
      const stream   = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current   = [];
      recorder.ondataavailable = e => audioChunksRef.current.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const file = new File([blob], "voice_note.webm", { type: "audio/webm" });
        setSelectedAudio(file);
        setAudioPreview(URL.createObjectURL(blob));
      };
      recorder.start();
      setIsRecording(true);
    } catch { setError("Microphone access denied."); }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
    mediaRecorderRef.current?.stream.getTracks().forEach(t => t.stop());
  };

  if (loading) return (
    <Layout>
      <div className="h-[70vh] flex flex-col items-center justify-center text-gray-400 font-black italic uppercase tracking-widest">
        <Loader2 className="animate-spin mb-4" size={36}/> Connecting…
      </div>
    </Layout>
  );

  return (
    <Layout>
      {/* Full-height chat layout */}
      <div className="flex flex-col h-[calc(100vh-64px)] max-w-3xl mx-auto px-0 sm:px-4 sm:py-4">

        {/* ── Header ─── */}
        <div className="flex items-center justify-between px-4 py-3 sm:py-4 border-b border-gray-100 bg-white sm:rounded-t-[2rem] shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="bg-gray-900 p-2 sm:p-3 rounded-xl sm:rounded-2xl text-white shadow-lg shrink-0">
              <Headphones size={18} />
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-xl font-black italic uppercase tracking-tight text-gray-800 truncate">
                Support <span className="text-[#3F2171]">Desk</span>
              </h1>
              <p className="text-[8px] font-black uppercase text-gray-400 tracking-widest">FricaLearn Admin Channel</p>
            </div>
          </div>
          <div className="bg-white px-3 py-1.5 rounded-xl border-2 border-gray-100 flex items-center gap-1.5 shadow-sm shrink-0">
            <ShieldCheck size={12} className="text-blue-500" />
            <span className="text-[9px] font-black uppercase tracking-widest text-gray-800 hidden sm:block">Verified</span>
          </div>
        </div>

        {/* ── Messages ─── */}
        <div ref={scrollRef}
          className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4 bg-gray-50/50">
          {messages.length === 0 && (
            <div className="text-center py-16">
              <Headphones size={36} className="text-gray-200 mx-auto mb-3"/>
              <p className="font-black text-gray-400 uppercase italic text-sm">No messages yet</p>
              <p className="text-gray-300 font-bold text-xs mt-1">Send us a message — we usually reply within a few hours</p>
            </div>
          )}
          {messages.map((m) => {
            const isMe = Number(m.sender_id) === Number(user?.id);
            return (
              <div key={m.id} className={`flex ${isMe ? "justify-end" : "justify-start"} animate-in fade-in`}>
                <div className={`max-w-[80%] sm:max-w-[70%] flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                  <div className={`px-4 py-3 sm:px-5 sm:py-4 rounded-[1.5rem] shadow-sm ${
                    isMe ? "bg-[#3F2171] text-white rounded-tr-none" : "bg-white text-gray-800 rounded-tl-none border border-gray-100"
                  }`}>
                    <div className="flex items-center gap-1.5 mb-1.5 opacity-40">
                      {isMe ? <User size={9}/> : <LifeBuoy size={9}/>}
                      <span className="text-[8px] font-black uppercase tracking-widest">{isMe ? "Parent" : "FricaLearn Admin"}</span>
                    </div>
                    {m.image_path && (
                      <img src={getMediaUrl(m.image_path)}
                        className="rounded-xl mb-2 max-w-full border-2 border-white/20"
                        alt="upload"/>
                    )}
                    {m.audio_path && (
                      <audio controls src={getMediaUrl(m.audio_path)}
                        className="w-full mb-2 h-8 max-w-[240px]"/>
                    )}
                    {m.message && <p className="text-sm font-bold leading-relaxed">{m.message}</p>}
                  </div>
                  <div className="mt-0.5 px-3 text-[8px] font-black uppercase tracking-widest text-gray-400">
                    {new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Attachment previews ─── */}
        {(imagePreview || audioPreview) && (
          <div className="px-4 py-3 bg-white border-t border-gray-100 flex gap-3 shrink-0">
            {imagePreview && (
              <div className="relative">
                <img src={imagePreview} className="h-14 w-14 rounded-xl object-cover border-2 border-[#3F2171]" alt="preview"/>
                <button onClick={() => { setImagePreview(null); setSelectedImage(null); }}
                  className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5">
                  <X size={10}/>
                </button>
              </div>
            )}
            {audioPreview && (
              <div className="flex items-center bg-blue-50 px-3 py-1.5 rounded-xl border-2 border-blue-100 gap-2">
                <Mic size={14} className="text-blue-500"/>
                <span className="text-[9px] font-black uppercase text-blue-900">Voice Note Ready</span>
                <button onClick={() => { setAudioPreview(null); setSelectedAudio(null); }} className="text-red-400 ml-2">
                  <Trash2 size={14}/>
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── Error ─── */}
        {error && (
          <div className="mx-4 mb-2 bg-red-50 border border-red-200 text-red-600 text-[10px] font-black uppercase px-3 py-2 rounded-xl shrink-0">
            {error}
          </div>
        )}

        {/* ── Input bar ─── */}
        <div className="px-3 py-3 sm:px-5 sm:py-4 bg-white border-t border-gray-100 sm:rounded-b-[2rem] shrink-0">
          <form onSubmit={handleSend} className="flex gap-2 items-center">
            <input type="file" ref={fileInputRef} onChange={handleImageSelect} className="hidden" accept="image/*"/>
            {/* Image button */}
            <button type="button" onClick={() => fileInputRef.current?.click()}
              className="p-2.5 sm:p-3 bg-gray-50 rounded-xl text-gray-400 hover:text-gray-700 transition-colors shrink-0">
              <ImageIcon size={18}/>
            </button>
            {/* Mic button */}
            {isRecording ? (
              <button type="button" onClick={stopRecording}
                className="p-2.5 sm:p-3 bg-red-50 text-red-500 rounded-xl animate-pulse shrink-0">
                <Square size={18} fill="currentColor"/>
              </button>
            ) : (
              <button type="button" onClick={startRecording}
                className="p-2.5 sm:p-3 bg-gray-50 rounded-xl text-gray-400 hover:text-blue-500 transition-colors shrink-0">
                <Mic size={18}/>
              </button>
            )}
            {/* Text input */}
            <input value={newMessage} onChange={e => setNewMessage(e.target.value)}
              placeholder={isRecording ? "Recording…" : "Type a message…"}
              className="flex-1 min-w-0 px-4 py-2.5 sm:py-3 bg-gray-50 rounded-2xl outline-none font-bold text-sm"
              disabled={isSending || isRecording}/>
            {/* Send button */}
            <button type="submit"
              disabled={isSending || (!newMessage.trim() && !selectedImage && !selectedAudio)}
              className="bg-[#2A1650] text-white p-3 sm:p-3.5 rounded-full hover:bg-[#3F2171] shadow-lg disabled:opacity-40 transition-all shrink-0">
              {isSending ? <Loader2 className="animate-spin" size={18}/> : <Send size={18}/>}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
