import React, { useState, useEffect, useRef } from "react";
import api from "../../api/axios";
import Layout from "../../components/Layout";
import { useAuth } from "../../hooks/useAuth";
import {
  Send,
  User,
  Loader2,
  MessageCircle,
  Image as ImageIcon,
  X,
  Mic,
  Square,
  Trash2,
} from "lucide-react";

export default function StudentChat() {
  const { user } = useAuth();
  const [conversation, setConversation] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // File Upload State
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 🎤 Audio Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [selectedAudio, setSelectedAudio] = useState<File | null>(null);
  const [audioPreview, setAudioPreview] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    fetchChat();
  }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      fetchChat(false);
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchChat = async (showLoader = true) => {
    if (showLoader) setLoading(true);
    try {
      const res = await api.get("/chat/conversation");
      setConversation(res.data);
      if (res.data.messages?.length !== messages.length)
        setMessages(res.data.messages || []);
    } catch (err) {
      console.error(err);
    } finally {
      if (showLoader) setLoading(false);
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
      alert(
        "Microphone access denied. Please allow microphone permissions to send voice notes.",
      );
      console.error(err);
    }
  };

  // ⏹️ STOP RECORDING FUNCTION
  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
    mediaRecorderRef.current?.stream
      .getTracks()
      .forEach((track) => track.stop()); // Turn off mic light
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      (!newMessage.trim() && !selectedImage && !selectedAudio) ||
      !conversation?.id ||
      sending
    )
      return;

    setSending(true);

    const formData = new FormData();
    formData.append("conversation_id", conversation.id);
    if (newMessage.trim()) formData.append("message", newMessage);
    if (selectedImage) formData.append("image", selectedImage);
    if (selectedAudio) formData.append("audio", selectedAudio); // Attach the audio file!

    try {
      const res = await api.post("/chat/message", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessages((prevMessages) => [...prevMessages, res.data]);
      setNewMessage("");
      setSelectedImage(null);
      setImagePreview(null);
      setSelectedAudio(null);
      setAudioPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

      setTimeout(scrollToBottom, 100);
    } catch (err) {
      console.error("Message failed to send:", err);
    } finally {
      setSending(false);
    }
  };

  if (loading)
    return (
      <Layout>
        <div className="flex justify-center mt-20">
          <Loader2 size={40} className="animate-spin text-[#2D5A27]" />
        </div>
      </Layout>
    );

  return (
    <Layout>
      <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col p-2 md:p-6">
        {/* --- CHAT HEADER --- */}
        <div className="bg-white p-4 md:p-6 rounded-t-[2.5rem] border-2 border-b-0 border-gray-100 flex items-center shadow-sm">
          <div className="bg-[#2D5A27]/10 p-3 rounded-2xl text-[#2D5A27] mr-4">
            <User size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-800 tracking-tight">
              Tutor Yusuf
            </h2>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Personal Support
              </span>
            </div>
          </div>
        </div>

        {/* --- MESSAGE AREA --- */}
        <div className="flex-1 bg-gray-50 border-x-2 border-gray-100 overflow-y-auto p-4 md:p-8 space-y-6 no-scrollbar shadow-inner">
          {messages.map((msg) => {
            const isMe = Number(msg.sender_id) === Number(user?.id);
            return (
              <div
                key={msg.id}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] md:max-w-[70%] p-4 md:p-5 rounded-[1.8rem] font-bold shadow-sm ${
                    isMe
                      ? "bg-[#2D5A27] text-white rounded-tr-none"
                      : "bg-white text-gray-700 rounded-tl-none border-2 border-gray-50"
                  }`}
                >
                  {/* Render Image */}
                  {msg.image_path && (
                    <img
                      src={`http://localhost:8000/storage/${msg.image_path}`}
                      alt="attachment"
                      className="rounded-xl mb-3 max-w-full shadow-sm"
                    />
                  )}

                  {/* 👈 RENDER AUDIO PLAYER */}
                  {msg.audio_path && (
                    <audio
                      controls
                      src={`http://localhost:8000/storage/${msg.audio_path}`}
                      className="w-full mb-2 h-10"
                    />
                  )}

                  {/* Render Text */}
                  {msg.message && (
                    <p className="leading-relaxed text-sm md:text-base">
                      {msg.message}
                    </p>
                  )}

                  <div
                    className={`text-[8px] mt-2 opacity-50 font-black uppercase tracking-widest ${isMe ? "text-right" : "text-left"}`}
                  >
                    {new Date(msg.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* --- INPUT AREA --- */}
        <div className="bg-white p-4 md:p-6 rounded-b-[2.5rem] border-2 border-t-0 border-gray-100 shadow-xl flex flex-col gap-4">
          {/* Previews Container */}
          <div className="flex gap-4">
            {/* Image Preview */}
            {imagePreview && (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-16 w-auto rounded-xl border-2 border-gray-200"
                />
                <button
                  type="button"
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

            {/* 👈 Audio Preview */}
            {audioPreview && (
              <div className="relative flex items-center bg-gray-100 p-2 rounded-xl pr-8 border-2 border-[#2D5A27]">
                <audio controls src={audioPreview} className="h-10 w-48" />
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
            onSubmit={handleSendMessage}
            className="flex items-center gap-2 md:gap-3"
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
              className="p-3 md:p-4 bg-gray-50 text-gray-400 rounded-2xl hover:text-[#2D5A27]"
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
                <span className="text-xs font-black hidden md:block">
                  RECORDING...
                </span>
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
              placeholder={
                isRecording ? "Recording voice note..." : "Type a message..."
              }
              className="flex-1 bg-gray-50 border-2 border-transparent focus:border-[#2D5A27] p-3 md:p-4 rounded-2xl outline-none font-bold"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              disabled={sending || isRecording}
            />

            <button
              type="submit"
              disabled={
                (!newMessage.trim() && !selectedImage && !selectedAudio) ||
                sending ||
                isRecording
              }
              className="bg-gray-900 text-white p-3 md:p-4 rounded-2xl hover:bg-[#2D5A27] disabled:opacity-30"
            >
              {sending ? (
                <Loader2 size={24} className="animate-spin" />
              ) : (
                <Send size={24} />
              )}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
