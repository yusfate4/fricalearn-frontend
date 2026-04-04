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

  // 🚀 THE FIX: Use Cloudinary/Dynamic URL logic instead of hardcoded 127.0.0.1
  const getMediaUrl = (path: string) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `https://res.cloudinary.com/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/video/upload/${path}`;
  };

  const fetchMessages = async () => {
    try {
      const res = await api.get("/chat/conversation");
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
    const interval = setInterval(fetchMessages, 15000); 
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
    const formData = new FormData();
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
      setError(err.response?.data?.message || "Delivery failed.");
      setTimeout(() => setError(null), 4000);
    } finally {
      setIsSending(false);
    }
  };

  if (loading) return <Layout><div className="h-[70vh] flex flex-col items-center justify-center font-black italic uppercase text-gray-400 tracking-widest"><Loader2 className="animate-spin mb-4" size={40} /> Syncing Channel...</div></Layout>;

  return (
    <Layout>
      {/* Container: Full height minus Navbar on mobile, standard max-width on desktop */}
      <div className="max-w-5xl mx-auto px-2 py-4 md:p-10 h-[calc(100vh-80px)] md:h-[calc(100vh-120px)] flex flex-col">
        
        {/* Header: Smaller font on mobile */}
        <div className="flex justify-between items-center mb-4 md:mb-6 px-2">
            <div>
                <h1 className="text-2xl md:text-5xl font-black italic uppercase tracking-tighter text-gray-800">Tutor Chat</h1>
                <p className="text-[8px] md:text-[10px] font-black uppercase text-gray-400 tracking-widest">Secure help line</p>
            </div>
            <div className="bg-white px-3 py-2 md:px-5 md:py-3 rounded-xl md:rounded-2xl border-2 border-gray-100 flex items-center gap-2 shadow-sm">
                <ShieldCheck size={14} className="text-[#2D5A27]" />
                <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-gray-800">Secure</span>
            </div>
        </div>

        {/* Chat Window: Removed massive borders for mobile to maximize space */}
        <div className="bg-white rounded-[1.5rem] md:rounded-[3.5rem] shadow-xl border-2 md:border-4 border-white overflow-hidden flex flex-col flex-1 relative">
          
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-10 space-y-6 md:space-y-8 bg-gray-50/50 custom-scrollbar">
            {messages.map((m) => {
              const isMe = Number(m.sender_id) === Number(user?.id);
              return (
                <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-1`}>
                  <div className={`max-w-[85%] md:max-w-[65%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <div className={`p-4 md:p-6 rounded-[1.2rem] md:rounded-[2.2rem] shadow-sm ${
                        isMe ? 'bg-[#2D5A27] text-white rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                    }`}>
                      {m.image_path && (
                        <img 
                            src={getMediaUrl(m.image_path)} 
                            className="rounded-xl mb-3 max-w-full" 
                            alt="upload" 
                        />
                      )}
                      {m.audio_path && (
                        <audio controls src={getMediaUrl(m.audio_path)} className="w-full mb-3 h-8 md:h-10" />
                      )}
                      {m.message && <p className="text-xs md:text-base font-bold leading-relaxed">{m.message}</p>}
                    </div>
                    <div className="mt-1 px-2 text-[8px] font-black uppercase tracking-widest text-gray-400">
                        {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Previews: Float above input */}
          {(imagePreview || audioPreview) && (
            <div className="px-4 py-2 bg-white flex gap-2 animate-in slide-in-from-bottom-2">
                {imagePreview && (
                    <div className="relative">
                        <img src={imagePreview} className="h-14 w-14 rounded-xl object-cover border-2 border-[#2D5A27]" />
                        <button onClick={() => {setImagePreview(null); setSelectedImage(null);}} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1"><X size={10}/></button>
                    </div>
                )}
                {audioPreview && (
                    <div className="relative flex items-center bg-gray-50 p-2 rounded-xl border border-[#2D5A27]">
                        <span className="text-[8px] font-black uppercase mr-2 text-[#2D5A27]">Voice Note OK</span>
                        <button onClick={() => {setAudioPreview(null); setSelectedAudio(null);}} className="text-red-500"><Trash2 size={14}/></button>
                    </div>
                )}
            </div>
          )}

          {/* Input Area: Sticky and compact */}
          <div className="p-3 md:p-8 bg-white border-t border-gray-50">
            <form onSubmit={handleSendMessage} className="flex gap-2 md:gap-4 items-center">
              <input type="file" ref={fileInputRef} onChange={handleImageSelect} className="hidden" accept="image/*" />
              
              <div className="flex gap-1 md:gap-2">
                <button type="button" onClick={() => fileInputRef.current?.click()} className="p-3 md:p-4 bg-gray-50 rounded-xl md:rounded-2xl text-gray-400 hover:text-[#2D5A27] transition-all"><ImageIcon size={20} md:size={24} /></button>
                
                {isRecording ? (
                    <button type="button" onClick={stopRecording} className="p-3 md:p-4 bg-red-50 text-red-500 rounded-xl animate-pulse"><Square size={20} fill="currentColor" /></button>
                ) : (
                    <button type="button" onClick={startRecording} className="p-3 md:p-4 bg-gray-50 rounded-xl md:rounded-2xl text-gray-400 hover:text-red-500"><Mic size={20} /></button>
                )}
              </div>

              <input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={isRecording ? "Recording..." : "Message..."}
                className="flex-1 p-3 md:p-5 bg-gray-50 rounded-xl md:rounded-[2rem] outline-none font-bold text-[13px] md:text-sm border-2 border-transparent focus:border-[#2D5A27]"
                disabled={isSending || isRecording}
              />
              
              <button 
                type="submit"
                disabled={isSending || (!newMessage.trim() && !selectedImage && !selectedAudio)} 
                className="bg-gray-900 text-white p-3 md:p-5 rounded-full hover:bg-[#2D5A27] transition-all shadow-lg min-w-[48px] md:min-w-[64px] flex items-center justify-center"
              >
                {isSending ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}