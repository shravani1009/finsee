'use client'

import { createContext, useContext, useState } from 'react';

const SpeechContext = createContext();

export function SpeechProvider({ children }) {
  const [isListening, setIsListening] = useState(false);

  const value = {
    isListening,
    setIsListening,
  };

  return (
    <SpeechContext.Provider value={value}>
      {children}
    </SpeechContext.Provider>
  );
}

export function useSpeech() {
  const context = useContext(SpeechContext);
  if (context === undefined) {
    throw new Error('useSpeech must be used within a SpeechProvider');
  }
  return context;
}