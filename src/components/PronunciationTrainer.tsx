import React, { useState } from 'react';
import { Mic, Play, CheckCircle } from 'lucide-react';

export default function PronunciationTrainer({ word }: { word: string }) {
  const [recording, setRecording] = useState(false);
  const [result, setResult] = useState<any>(null);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    const audioChunks: any[] = [];

    mediaRecorder.ondataavailable = (event) => audioChunks.push(event.data);
    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
      const formData = new FormData();
      formData.append('audio', audioBlob);
      formData.append('expected_text', word);

      const res = await api.post('/ai/verify-pronunciation', formData);
      setResult(res.data);
    };

    mediaRecorder.start();
    setRecording(true);
    setTimeout(() => { mediaRecorder.stop(); setRecording(false); }, 3000);
  };

  return (
    <div className="p-6 bg-white rounded-3xl border-2 border-gray-100 shadow-sm text-center">
      <p className="text-2xl font-black italic mb-4 uppercase">{word}</p>
      
      <button 
        onClick={startRecording}
        className={`p-6 rounded-full transition-all ${recording ? 'bg-red-500 animate-pulse' : 'bg-[#2D5A27] hover:scale-110'}`}
      >
        <Mic className="text-white" size={32} />
      </button>

      {result && (
        <div className="mt-6 animate-in zoom-in">
          <p className="text-4xl font-black text-[#2D5A27]">{result.score}%</p>
          <p className="text-xs font-bold text-gray-400 mt-2 uppercase italic">"{result.feedback}"</p>
        </div>
      )}
    </div>
  );
}