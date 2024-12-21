// app/hooks/useVoiceCommand.js
'use client';
import { useState, useEffect, useCallback } from 'react';

export function useVoiceCommand(onWakeWord) {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);

  const startListening = useCallback(() => {
    if (!recognition) return;
    
    try {
      recognition.start();
    } catch (error) {
      console.log('Recognition already started');
    }
  }, [recognition]);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const recognitionInstance = new window.webkitSpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = false;

      recognitionInstance.onstart = () => {
        setIsListening(true);
        console.log('Voice recognition activated');
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
        // Restart recognition after it ends
        startListening();
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        if (event.error === 'no-speech') {
          startListening();
        }
      };

      recognitionInstance.onresult = (event) => {
        const command = event.results[event.results.length - 1][0].transcript.toLowerCase();
        console.log('Heard:', command);
        
        if (command.includes('hey bot') || command.includes('hay bot') || command.includes('hey board')) {
          onWakeWord();
        }
      };

      setRecognition(recognitionInstance);

      // Start listening after a short delay to ensure setup is complete
      setTimeout(() => {
        startListening();
      }, 1000);
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [onWakeWord]);

  return isListening;
}
