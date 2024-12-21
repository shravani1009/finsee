
// app/components/VoiceWakeWord.jsx
'use client';
import { useVoiceCommand } from '../hooks/useVoiceCommand';

export default function VoiceWakeWord({ onWakeWord }) {
  const isListening = useVoiceCommand(onWakeWord);
  
  return (
    <div className="fixed bottom-20 left-6">
      <div className={`w-3 h-3 rounded-full ${isListening ? 'bg-green-500' : 'bg-red-500'}`}></div>
    </div>
  );
}
