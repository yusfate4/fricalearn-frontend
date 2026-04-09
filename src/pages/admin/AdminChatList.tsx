import React, { useState, useEffect, useRef } from "react";
import api from "../../api/axios";
import Layout from "../../components/Layout";
import {
  User,
  Send,
  Loader2,
  MessageSquare,
  ChevronLeft,
  CheckCheck,
  Image as ImageIcon,
  X,
  Mic,
  Square,
  Trash2,
  ShieldCheck,
  AlertCircle,
  Headphones, // 👈 Added for branding
  LifeBuoy, // 👈 Added for branding
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export default function AdminChatList() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [newMessage, setNewMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [selectedAudio, setSelectedAudio] = useState<File | null>(null);
  const [audioPreview, setAudioPreview] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 🚀 CLOUDINARY LOGIC: Fixes the media paths for production
  const getMediaUrl = (path: string) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `https://res.cloudinary.com/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/all/upload/${path}`;
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const interval = setInterval(fetchConversations, 15000);
    return () => clearInterval(interval);
  }, []);

  const fetchConversations = async () => {
    try {
      const res = await api.get(
        `/admin/conversations?t=${new Date().getTime()}`,
      );
      setConversations(res.data || []);
    } catch (err) {
      console.error("Failed to sync conversations", err);
    } finally {
      setLoading(false);
    }
  };

  const selectConversation = async (chat: any) => {
    setSelectedChat(chat);
    setError(null);
    try {
      await api.post(`/admin/conversations/${chat.id}/read`);
      const res = await api.get(`/admin/conversations/${chat.id}/messages`);
      setMessages(res.data || []);
      fetchConversations();
    } catch (err) {
      setError("Could not load messages.");
    }
  };

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
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        const file = new File([audioBlob], "voice_note.webm", {
          type: "audio/webm",
        });
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
    mediaRecorderRef.current?.stream
      .getTracks()
      .forEach((track) => track.stop());
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. 🛡️ Initial Guard: Don't send if everything is empty or system is busy
    if (
      (!newMessage.trim() && !selectedImage && !selectedAudio) ||
      !selectedChat ||
      sending ||
      isRecording
    ) {
      return;
    }

    setSending(true);
    setError(null);

    /**
     * 🚀 THE ID MAPPING LOGIC
     * We must target the Parent/Student's User ID.
     * In your backend response, this is usually 'student_id' or 'user_id'.
     * 'selectedChat.id' is typically the Conversation ID, which Laravel will reject.
     */
    const recipientId = selectedChat.student_id || selectedChat.user_id;

    if (!recipientId) {
      console.error("Recipient ID Missing!", selectedChat);
      setError("Recipient ID not found. Please refresh the chat.");
      setSending(false);
      return;
    }

    // 📦 Prepare Multipart Form Data
    const formData = new FormData();
    formData.append("receiver_id", recipientId.toString());

    if (newMessage.trim()) {
      formData.append("message", newMessage);
    }

    if (selectedImage) {
      formData.append("image", selectedImage);
    }

    if (selectedAudio) {
      formData.append("audio", selectedAudio);
    }

    try {
      // 🌍 Dispatch to Railway Production
      const res = await api.post("/chat/message", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // 2. ✅ Update UI State locally for instant feedback
      setMessages((prev) => [...prev, res.data]);

      // 3. 🧹 Reset all inputs and previews
      setNewMessage("");
      setSelectedImage(null);
      setImagePreview(null);
      setSelectedAudio(null);
      setAudioPreview(null);

      // Reset file input element if it exists
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err: any) {
      console.error("Message Delivery Error:", err);

      // Specifically handle the 422 "Invalid Receiver" error for better debugging
      if (err.response?.status === 422) {
        setError(
          "The recipient ID is invalid. Verify the backend is returning 'student_id'.",
        );
      } else {
        setError(
          err.response?.data?.message || "Delivery failed. Please try again.",
        );
      }

      // Auto-clear error after 5 seconds
      setTimeout(() => setError(null), 5000);
    } finally {
      setSending(false);
    }
  };

  if (loading)
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-[70vh]">
          <Loader2 className="animate-spin text-[#2D5A27] mb-4" size={48} />
          <p className="font-black text-gray-400 uppercase tracking-widest italic text-xs">
            Syncing Admin Inbox...
          </p>
        </div>
      </Layout>
    );

  return (
    <Layout>
      <div className="max-w-7xl mx-auto h-[calc(100vh-100px)] md:h-[calc(100vh-140px)] flex flex-col md:flex-row gap-4 p-2 md:p-6">
        {/* --- LEFT: CONVERSATION LIST --- */}
        <div
          className={`${selectedChat ? "hidden md:flex" : "flex"} w-full md:w-96 bg-white rounded-[2.5rem] border-2 border-gray-100 flex-col overflow-hidden shadow-sm`}
        >
          <div className="p-6 border-b-2 border-gray-50 flex items-center justify-between bg-gray-50/50">
            <h2 className="text-xl font-black text-gray-800 uppercase italic">
              Support Desk
            </h2>
            <div className="bg-[#2D5A27] text-white text-[10px] font-black px-3 py-1 rounded-full">
              {conversations.filter((c) => !c.is_read).length} PENDING
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
            {conversations.length > 0 ? (
              conversations.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => selectConversation(chat)}
                  className={`w-full p-5 rounded-[2rem] flex items-center gap-4 transition-all relative group ${
                    selectedChat?.id === chat.id
                      ? "bg-gray-900 text-white shadow-xl scale-[1.02]"
                      : "hover:bg-gray-50 text-gray-600 border border-transparent hover:border-gray-100"
                  }`}
                >
                  <div
                    className={`p-3 rounded-2xl flex-shrink-0 ${selectedChat?.id === chat.id ? "bg-white/20" : "bg-gray-100"}`}
                  >
                    <User size={20} />
                  </div>
                  <div className="flex-1 text-left overflow-hidden">
                    <div className="flex justify-between items-center mb-0.5">
                      <p className="font-black text-[11px] truncate uppercase italic tracking-tight">
                        {chat.display_name}
                      </p>
                      <span className="text-[8px] font-black opacity-40">
                        {chat.updated_at}
                      </span>
                    </div>
                    <p className="text-[10px] truncate font-bold opacity-70 italic">
                      {chat.last_message || "Voice note / Image"}
                    </p>
                  </div>
                  {!chat.is_read && selectedChat?.id !== chat.id && (
                    <div className="h-2.5 w-2.5 bg-orange-500 rounded-full shadow-lg animate-pulse" />
                  )}
                </button>
              ))
            ) : (
              <div className="text-center py-20 opacity-30">
                <MessageSquare className="mx-auto mb-2" />
                <p className="text-[10px] font-black uppercase">
                  No active inquiries
                </p>
              </div>
            )}
          </div>
        </div>

        {/* --- RIGHT: ACTIVE CHAT --- */}
        <div
          className={`${!selectedChat ? "hidden md:flex" : "flex"} flex-1 bg-white rounded-[2.5rem] md:rounded-[3rem] border-2 border-gray-100 flex-col overflow-hidden shadow-sm relative`}
        >
          {selectedChat ? (
            <>
              {/* Header */}
              <div className="p-4 md:p-6 border-b-2 border-gray-50 flex items-center justify-between bg-gray-50/30">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setSelectedChat(null)}
                    className="md:hidden p-2 hover:bg-gray-100 rounded-xl"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <div className="bg-gray-900 p-3 rounded-2xl text-white">
                    <Headphones size={20} />
                  </div>
                  <div>
                    <span className="font-black text-gray-800 block text-base md:text-lg leading-none italic uppercase tracking-tighter">
                      {selectedChat.display_name}
                    </span>
                    <span className="text-[8px] md:text-[9px] font-black text-[#2D5A27] uppercase tracking-[0.2em] mt-1 block flex items-center gap-2">
                      <ShieldCheck size={10} /> Official Parent Inquiry
                    </span>
                  </div>
                </div>
              </div>

              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto p-4 md:p-10 space-y-6 bg-gray-50/30 custom-scrollbar">
                {messages.map((msg) => {
                  const isMe = Number(msg.sender_id) === Number(user?.id);
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[90%] md:max-w-[70%] p-5 rounded-[1.8rem] md:rounded-[2rem] font-bold text-xs md:text-sm shadow-sm ${
                          isMe
                            ? "bg-[#2D5A27] text-white rounded-tr-none"
                            : "bg-white text-gray-700 rounded-tl-none border-2 border-gray-100"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2 opacity-40">
                          {isMe ? <LifeBuoy size={10} /> : <User size={10} />}
                          <span className="text-[8px] font-black uppercase tracking-widest">
                            {isMe ? "Admin" : "Parent"}
                          </span>
                        </div>

                        {msg.image_path && (
                          <img
                            src={getMediaUrl(msg.image_path)}
                            alt="attachment"
                            className="rounded-2xl mb-3 max-w-full shadow-sm border-2 border-white/20"
                          />
                        )}
                        {msg.audio_path && (
                          <audio
                            controls
                            src={getMediaUrl(msg.audio_path)}
                            className="w-full mb-2 h-10"
                          />
                        )}
                        {msg.message && (
                          <p className="leading-relaxed whitespace-pre-wrap">
                            {msg.message}
                          </p>
                        )}

                        <div
                          className={`text-[8px] mt-2 flex items-center gap-1 opacity-50 uppercase ${isMe ? "justify-end" : "justify-start"}`}
                        >
                          {new Date(msg.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                          {isMe && (
                            <CheckCheck
                              size={12}
                              className={
                                msg.is_read ? "text-blue-300" : "text-gray-200"
                              }
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="bg-white p-4 md:p-6 border-t-2 border-gray-50">
                <div className="flex gap-4 mb-3">
                  {imagePreview && (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        className="h-16 w-16 rounded-xl object-cover border-2 border-[#2D5A27]"
                      />
                      <button
                        onClick={() => {
                          setSelectedImage(null);
                          setImagePreview(null);
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  )}
                  {audioPreview && (
                    <div className="relative flex items-center bg-gray-50 p-2 rounded-xl pr-10 border-2 border-[#2D5A27]">
                      <span className="text-[9px] font-black text-[#2D5A27] uppercase tracking-widest px-2">
                        Voice Note Attached
                      </span>
                      <button
                        onClick={() => {
                          setSelectedAudio(null);
                          setAudioPreview(null);
                        }}
                        className="absolute right-2 text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>

                <form
                  onSubmit={handleSend}
                  className="flex gap-2 md:gap-3 items-center"
                >
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-4 bg-gray-50 text-gray-400 rounded-2xl hover:text-gray-900"
                  >
                    <ImageIcon size={22} />
                  </button>
                  {isRecording ? (
                    <button
                      type="button"
                      onClick={stopRecording}
                      className="p-4 bg-red-100 text-red-500 rounded-2xl animate-pulse"
                    >
                      <Square size={22} fill="currentColor" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={startRecording}
                      className="p-4 bg-gray-50 text-gray-400 rounded-2xl hover:text-blue-500"
                    >
                      <Mic size={22} />
                    </button>
                  )}
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={isRecording ? "Listening..." : "Type reply..."}
                    className="flex-1 bg-gray-50 p-4 rounded-2xl outline-none font-bold text-sm border-2 border-transparent focus:border-gray-900"
                    disabled={sending || isRecording}
                  />
                  <button
                    type="submit"
                    disabled={
                      (!newMessage.trim() &&
                        !selectedImage &&
                        !selectedAudio) ||
                      sending
                    }
                    className="bg-gray-900 text-white p-5 rounded-full hover:bg-[#2D5A27] transition-all shadow-xl"
                  >
                    {sending ? (
                      <Loader2 size={24} className="animate-spin" />
                    ) : (
                      <Send size={24} />
                    )}
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-300 p-10 text-center">
              <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center mb-8">
                <Headphones size={64} className="opacity-10" />
              </div>
              <h3 className="text-2xl font-black uppercase italic tracking-tighter text-gray-400">
                Support Terminal
              </h3>
              <p className="font-bold text-xs mt-3 max-w-xs opacity-50 uppercase tracking-widest leading-relaxed">
                Select a parent inquiry from the list to begin professional
                correspondence.
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
