import React, { useState, useEffect, useRef } from "react";
import api from "../../api/axios";
import Layout from "../../components/Layout";
import { 
  Send, 
  ShieldCheck, 
  Loader2, 
  Clock,
  Image as ImageIcon,
  Mic,
  Square,
  Trash2,
  X,
  AlertCircle
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export default function ParentMessages() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // --- Media State ---
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [selectedAudio, setSelectedAudio] = useState<File | null>(null);
  const [audioPreview, setAudioPreview] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Base storage URL
  const STORAGE_BASE = "http://127.0.0.1:8000/storage/";

  const fetchMessages = async () => {
    try {
      const res = await api.get("/chat/conversation");
      // 🚀 The API returns a conversation object with a messages array
      if (res.data && res.data.messages) {
        setMessages(res.data.messages);
      }
    } catch (err) {
      console.error("Failed to load messages", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 15000); // 15s sync
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];
      recorder.ondataavailable = (e) => audioChunksRef.current.push(e.data);
      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const file = new File([audioBlob], "voice_note.webm", { type: "audio/webm" });
        setSelectedAudio(file);
        setAudioPreview(URL.createObjectURL(audioBlob));
      };
      recorder.start();
      setIsRecording(true);
    } catch (err) {
      setError("Microphone access denied.");
      setTimeout(() => setError(null), 3000);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
    mediaRecorderRef.current?.stream.getTracks().forEach(track => track.stop());
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!newMessage.trim() && !selectedImage && !selectedAudio) || isSending || isRecording) return;

    setIsSending(true);
    setError(null);

    const formData = new FormData();
    // 🚀 We send receiver_id: 1 (Yusuf/Tutor) and let the backend find the convo
    formData.append("receiver_id", "1"); 
    if (newMessage.trim()) formData.append("message", newMessage);
    if (selectedImage) formData.append("image", selectedImage);
    if (selectedAudio) formData.append("audio", selectedAudio);

    try {
      const res = await api.post("/chat/message", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setMessages(prev => [...prev, res.data]);
      setNewMessage("");
      setSelectedImage(null);
      setImagePreview(null);
      setSelectedAudio(null);
      setAudioPreview(null);
    } catch (err: any) {
      setError(err.response?.data?.message || "Delivery failed. Try again.");
      setTimeout(() => setError(null), 4000);
    } finally {
      setIsSending(false);
    }
  };

  if (loading) return <Layout><div className="h-[70vh] flex flex-col items-center justify-center font-black italic uppercase text-gray-400 tracking-widest"><Loader2 className="animate-spin mb-4" size={40} /> Syncing Channel...</div></Layout>;

  return (
    <Layout>
      <div className="max-w-5xl mx-auto p-4 md:p-10 h-[calc(100vh-120px)] flex flex-col">
        <div className="flex justify-between items-center mb-6 px-2">
            <div>
                <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-gray-800">Tutor Chat</h1>
                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mt-1">Direct line to your child's guide</p>
            </div>
            <div className="hidden md:flex bg-white px-5 py-3 rounded-2xl border-2 border-gray-100 items-center gap-3 shadow-sm">
                <ShieldCheck size={20} className="text-[#2D5A27]" />
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-800">End-to-End Secure</span>
            </div>
        </div>

        <div className="bg-white rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl border-4 border-white overflow-hidden flex flex-col flex-1 relative">
          
          {/* Chat Window */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-10 space-y-8 bg-gray-50/50 custom-scrollbar">
            {messages.map((m) => {
              const isMe = Number(m.sender_id) === Number(user?.id);
              return (
                <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                  <div className={`max-w-[90%] md:max-w-[65%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <div className={`p-4 md:p-6 rounded-[1.8rem] md:rounded-[2.2rem] shadow-sm ${
                        isMe ? 'bg-[#2D5A27] text-white rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none border-2 border-gray-100'
                    }`}>
                      {m.image_path && (
                        <img 
                            src={`${STORAGE_BASE}${m.image_path}`} 
                            className="rounded-2xl mb-3 max-w-full shadow-sm hover:scale-[1.02] transition-transform cursor-pointer" 
                            alt="upload" 
                        />
                      )}
                      {m.audio_path && (
                        <audio controls src={`${STORAGE_BASE}${m.audio_path}`} className="w-full mb-3 h-10" />
                      )}
                      {m.message && <p className="text-sm md:text-base font-bold leading-relaxed whitespace-pre-wrap">{m.message}</p>}
                    </div>
                    <div className="mt-2 px-2 text-[8px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                        <Clock size={10} /> {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Error Message */}
          {error && (
            <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-20 bg-red-600 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-2xl animate-in slide-in-from-bottom-4">
               <AlertCircle size={14} /> {error}
            </div>
          )}

          {/* Input & Previews */}
          <div className="p-4 md:p-8 bg-white border-t-2 border-gray-50">
            <div className="flex gap-4 mb-4 empty:hidden">
                {imagePreview && (
                    <div className="relative group">
                        <img src={imagePreview} className="h-20 w-20 rounded-2xl object-cover border-2 border-[#2D5A27]" />
                        <button onClick={() => {setImagePreview(null); setSelectedImage(null);}} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:scale-110 transition-transform"><X size={14}/></button>
                    </div>
                )}
                {audioPreview && (
                    <div className="relative flex items-center bg-gray-50 p-2 rounded-2xl border-2 border-[#2D5A27] pr-10">
                        <audio src={audioPreview} controls className="h-10 w-40 md:w-56" />
                        <button onClick={() => {setAudioPreview(null); setSelectedAudio(null);}} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:scale-110 transition-transform"><Trash2 size={14}/></button>
                    </div>
                )}
            </div>

            <form onSubmit={handleSendMessage} className="flex gap-2 md:gap-4 items-center">
              <input type="file" ref={fileInputRef} onChange={handleImageSelect} className="hidden" accept="image/*" />
              <button type="button" onClick={() => fileInputRef.current?.click()} className="p-4 bg-gray-50 rounded-2xl text-gray-400 hover:bg-[#2D5A27]/10 hover:text-[#2D5A27] transition-all"><ImageIcon size={24} /></button>
              
              {isRecording ? (
                <button type="button" onClick={stopRecording} className="p-4 bg-red-50 text-red-500 rounded-2xl animate-pulse ring-2 ring-red-100"><Square size={24} fill="currentColor" /></button>
              ) : (
                <button type="button" onClick={startRecording} className="p-4 bg-gray-50 rounded-2xl text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all"><Mic size={24} /></button>
              )}

              <input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={isRecording ? "Listening..." : "Message Tutor..."}
                className="flex-1 p-4 md:p-5 bg-gray-50 rounded-[1.5rem] md:rounded-[2rem] outline-none font-bold text-sm border-2 border-transparent focus:border-[#2D5A27] transition-all"
                disabled={isSending || isRecording}
              />
              <button 
                type="submit"
                disabled={isSending || (!newMessage.trim() && !selectedImage && !selectedAudio)} 
                className="bg-gray-900 text-white p-4 md:p-5 rounded-full hover:bg-[#2D5A27] transition-all shadow-xl disabled:opacity-30 active:scale-95 flex items-center justify-center min-w-[56px] md:min-w-[64px]"
              >
                {isSending ? <Loader2 className="animate-spin" size={24} /> : <Send size={24} />}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}