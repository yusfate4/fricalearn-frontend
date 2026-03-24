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
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export default function AdminChatList() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);

  // Message Input State
  const [newMessage, setNewMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 🎤 Audio Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [selectedAudio, setSelectedAudio] = useState<File | null>(null);
  const [audioPreview, setAudioPreview] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-sync every 10 seconds
  useEffect(() => {
    const interval = setInterval(fetchConversations, 10000);
    return () => clearInterval(interval);
  }, [selectedChat]);

  const fetchConversations = async () => {
    try {
      const res = await api.get(
        `/admin/conversations?t=${new Date().getTime()}`,
      );
      const data = res.data || [];
      setConversations(data);

      if (selectedChat) {
        const updatedChat = data.find((c: any) => c.id === selectedChat.id);
        if (updatedChat && updatedChat.messages) {
          setMessages(updatedChat.messages);
        }
      }
    } catch (err) {
      console.error("Failed to sync conversations", err);
    } finally {
      setLoading(false);
    }
  };

  const selectConversation = async (chat: any) => {
    setSelectedChat(chat);
    try {
      await api.post(`/admin/conversations/${chat.id}/read`);
      const res = await api.get(
        `/chat/conversation?student_id=${chat.student_id}`,
      );
      setMessages(res.data.messages || []);
      fetchConversations();
    } catch (err) {
      console.error("Error selecting conversation:", err);
      setMessages(chat.messages || []);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // 🎙️ START RECORDING FUNCTION
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
      alert("Microphone access denied. Please allow microphone permissions.");
      console.error(err);
    }
  };

  // ⏹️ STOP RECORDING FUNCTION
  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
    mediaRecorderRef.current?.stream
      .getTracks()
      .forEach((track) => track.stop());
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      (!newMessage.trim() && !selectedImage && !selectedAudio) ||
      !selectedChat ||
      sending ||
      isRecording
    )
      return;

    setSending(true);

    const formData = new FormData();
    formData.append("conversation_id", selectedChat.id);
    if (newMessage.trim()) formData.append("message", newMessage);
    if (selectedImage) formData.append("image", selectedImage);
    if (selectedAudio) formData.append("audio", selectedAudio); // Attach the audio file!

    try {
      const res = await api.post("/chat/message", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessages((prev) => [...prev, res.data]);
      setNewMessage("");
      setSelectedImage(null);
      setImagePreview(null);
      setSelectedAudio(null);
      setAudioPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

      fetchConversations();
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-[70vh]">
          <Loader2 className="animate-spin text-[#2D5A27] mb-4" size={48} />
          <p className="font-black text-gray-400 uppercase tracking-widest italic">
            Syncing Inbox...
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto h-[calc(100vh-140px)] flex flex-col md:flex-row gap-4 p-2 md:p-6">
        {/* --- LEFT: STUDENT LIST --- */}
        <div
          className={`${selectedChat ? "hidden md:flex" : "flex"} w-full md:w-80 bg-white rounded-[2.5rem] border-2 border-gray-100 flex-col overflow-hidden shadow-sm`}
        >
          <div className="p-6 border-b-2 border-gray-50 flex items-center justify-between bg-gray-50/50">
            <h2 className="text-xl font-black text-gray-800 uppercase italic">
              Student Chats
            </h2>
            <div className="bg-[#2D5A27] text-white text-[10px] font-black px-2 py-1 rounded-full">
              {conversations.length}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2 no-scrollbar">
            {conversations.map((chat) => {
              const hasUnread = chat.messages?.some(
                (m: any) =>
                  !m.is_read && Number(m.sender_id) !== Number(user?.id),
              );

              // 👈 Updated Preview Logic for Audio
              const lastMessage =
                chat.messages && chat.messages.length > 0
                  ? chat.messages[chat.messages.length - 1]
                  : null;
              const previewText = lastMessage
                ? lastMessage.message ||
                  (lastMessage.audio_path
                    ? "🎤 Voice Note"
                    : lastMessage.image_path
                      ? "📸 Image attached"
                      : "New Student")
                : "New Student Connection";

              return (
                <button
                  key={chat.id}
                  onClick={() => selectConversation(chat)}
                  className={`w-full p-4 rounded-2xl flex items-center gap-3 transition-all relative ${
                    selectedChat?.id === chat.id
                      ? "bg-[#2D5A27] text-white shadow-lg"
                      : "hover:bg-gray-50 text-gray-600"
                  }`}
                >
                  <div
                    className={`p-2 rounded-xl flex-shrink-0 ${selectedChat?.id === chat.id ? "bg-white/20" : "bg-gray-100"}`}
                  >
                    <User size={20} />
                  </div>

                  <div className="flex-1 text-left overflow-hidden">
                    <p className="font-black text-sm truncate uppercase tracking-tight">
                      {chat.student?.name}
                    </p>
                    <p className="text-[10px] truncate font-bold opacity-70">
                      {previewText}
                    </p>
                  </div>

                  {hasUnread && selectedChat?.id !== chat.id && (
                    <div className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-white"></span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* --- RIGHT: ACTIVE CHAT --- */}
        <div
          className={`${!selectedChat ? "hidden md:flex" : "flex"} flex-1 bg-white rounded-[2.5rem] border-2 border-gray-100 flex-col overflow-hidden shadow-sm`}
        >
          {selectedChat ? (
            <>
              {/* Header */}
              <div className="p-4 md:p-6 border-b-2 border-gray-50 flex items-center gap-4 bg-gray-50/30">
                <button
                  onClick={() => setSelectedChat(null)}
                  className="md:hidden p-2 hover:bg-gray-100 rounded-xl"
                >
                  <ChevronLeft size={24} />
                </button>
                <div className="bg-[#2D5A27]/10 p-2 rounded-xl text-[#2D5A27]">
                  <User size={24} />
                </div>
                <div>
                  <span className="font-black text-gray-800 block leading-none">
                    {selectedChat.student?.name}
                  </span>
                  <span className="text-[10px] font-black text-[#2D5A27] uppercase tracking-widest italic">
                    Founder's Session
                  </span>
                </div>
              </div>

              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 bg-gray-50/50 no-scrollbar">
                {messages.map((msg) => {
                  const isMe = Number(msg.sender_id) === Number(user?.id);
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] md:max-w-[70%] p-4 rounded-[1.5rem] font-bold text-sm shadow-sm ${
                          isMe
                            ? "bg-gray-900 text-white rounded-tr-none"
                            : "bg-white text-gray-700 rounded-tl-none border-2 border-gray-100"
                        }`}
                      >
                        {/* Image Render */}
                        {msg.image_path && (
                          <img
                            src={`http://localhost:8000/storage/${msg.image_path}`}
                            alt="attachment"
                            className="rounded-xl mb-3 max-w-full border border-black/10 shadow-sm"
                          />
                        )}

                        {/* 👈 AUDIO RENDER FIX FOR ADMIN */}
                        {msg.audio_path && (
                          <audio
                            controls
                            src={`http://localhost:8000/storage/${msg.audio_path}`}
                            className="w-full mb-2 h-10"
                          />
                        )}

                        {/* Render Text */}
                        {msg.message && (
                          <p className="leading-relaxed">{msg.message}</p>
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
                                msg.is_read ? "text-blue-400" : "text-gray-400"
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
              <div className="bg-white p-4 md:p-6 border-t-2 border-gray-50 flex flex-col gap-4">
                {/* Previews Container */}
                <div className="flex gap-4">
                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="relative self-start">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-16 w-auto rounded-xl border-2 border-gray-200 object-cover shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedImage(null);
                          setImagePreview(null);
                          if (fileInputRef.current)
                            fileInputRef.current.value = "";
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:scale-110"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  )}

                  {/* Audio Preview */}
                  {audioPreview && (
                    <div className="relative flex items-center bg-gray-100 p-2 rounded-xl pr-8 border-2 border-[#2D5A27]">
                      <audio
                        controls
                        src={audioPreview}
                        className="h-10 w-48"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedAudio(null);
                          setAudioPreview(null);
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:scale-110"
                      >
                        <Trash2 size={12} />
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
                    className="p-3 md:p-4 bg-gray-50 text-gray-400 rounded-2xl hover:bg-[#2D5A27]/10 hover:text-[#2D5A27] transition-all"
                  >
                    <ImageIcon size={24} />
                  </button>

                  {/* 🎤 MIC / RECORD BUTTON */}
                  {isRecording ? (
                    <button
                      type="button"
                      onClick={stopRecording}
                      className="p-3 md:p-4 bg-red-100 text-red-500 rounded-2xl animate-pulse flex items-center gap-2"
                    >
                      <Square size={24} fill="currentColor" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={startRecording}
                      className="p-3 md:p-4 bg-gray-50 text-gray-400 rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all"
                    >
                      <Mic size={24} />
                    </button>
                  )}

                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={
                      isRecording
                        ? "Recording voice note..."
                        : "Type a response or attach a file..."
                    }
                    className="flex-1 bg-gray-50 p-3 md:p-4 rounded-2xl outline-none font-bold border-2 border-transparent focus:border-[#2D5A27] transition-all"
                    disabled={sending || isRecording}
                  />

                  <button
                    type="submit"
                    disabled={
                      (!newMessage.trim() &&
                        !selectedImage &&
                        !selectedAudio) ||
                      sending ||
                      isRecording
                    }
                    className="bg-[#2D5A27] text-white p-3 md:p-4 rounded-2xl hover:scale-105 transition-all disabled:opacity-50 shadow-lg shadow-[#2D5A27]/20"
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
              <MessageSquare size={64} className="opacity-10 mb-4" />
              <h3 className="text-xl font-black uppercase italic tracking-tighter">
                Student Inbox
              </h3>
              <p className="font-bold text-sm mt-2 max-w-xs">
                Select a student to start your private tutoring session.
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
