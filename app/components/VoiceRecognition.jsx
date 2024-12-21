'use client';
import { useEffect, useState } from 'react';

export default function VoiceRecognition({ onCommand }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    let recognition = null;

    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition;
      recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;

      recognition.onresult = (event) => {
        const command = event.results[event.results.length - 1][0].transcript.toLowerCase();
        onCommand(command);
      };

      recognition.start();
    }

    return () => {
      if (recognition) recognition.stop();
    };
  }, [onCommand]);

  // Don't render anything on server
  if (!isClient) return null;

  return null;
}