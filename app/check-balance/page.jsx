"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft,
  Wallet,
  Mic,
  Square,
  User
} from 'lucide-react';

export default function CheckBalancePage() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef(null);
  const router = useRouter();
  const initialAnnouncementMade = useRef(false);

  // Text-to-speech function
  const speak = (text) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  // Initial announcement
  useEffect(() => {
    if (!initialAnnouncementMade.current) {
      setTimeout(() => {
        speak("Your bank balance is 5000 rupees");
        initialAnnouncementMade.current = true;
        startRecording();
      }, 1000);
    }
  }, []);

  // Handle voice commands
  const handleVoiceCommand = (command) => {
    const lowerCommand = command.toLowerCase();

    if (lowerCommand.includes('balance')) {
      speak("Your bank balance is 5000 rupees");
      return;
    }

    if (lowerCommand.includes('go back') || lowerCommand.includes('home')) {
      speak("Going back to home page");
      router.push('/home');
      return;
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    recognitionRef.current = new window.webkitSpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;

    recognitionRef.current.onstart = () => {
      console.log("Voice recognition started");
    };

    recognitionRef.current.onresult = (event) => {
      const { transcript } = event.results[event.results.length - 1][0];
      setTranscript(transcript);
      handleVoiceCommand(transcript);
    };

    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
      setTimeout(startRecording, 1000);
    };

    recognitionRef.current.onend = () => {
      if (isRecording) {
        recognitionRef.current.start();
      }
    };

    recognitionRef.current.start();
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      window.speechSynthesis.cancel();
    };
  }, []);

  return (
    <div className="max-w-md mx-auto min-h-screen bg-white relative">
      {/* Header */}
      <div className="bg-blue-600 p-4 pb-8 rounded-b-[30px]">
        <div className="flex items-center justify-between mb-2">
          <button 
            className="p-2" 
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <span className="text-white font-medium">Check Balance</span>
          <button className="p-2">
            <User className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Balance Display */}
        <div className="mt-8 bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="bg-blue-50 p-4 rounded-full">
              <Wallet className="w-8 h-8 text-blue-600" />
            </div>
            <div className="text-center">
              <p className="text-gray-600 mb-2">Bank Balance</p>
              <h2 className="text-3xl font-bold text-gray-800">
                ₹5000.00
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* Voice Commands */}
      <div className="p-4 mt-6">
        {/* Voice Command Transcript */}
        {transcript && (
          <div className="mt-4 bg-gray-50 rounded-xl p-4">
            <p className="text-sm font-medium text-gray-600">Last command:</p>
            <p className="text-sm text-gray-800">{transcript}</p>
          </div>
        )}
      </div>

      {/* Microphone Button */}
      <div className="fixed bottom-6 right-6">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`flex items-center justify-center ${
            isRecording ? 'bg-red-500' : 'bg-blue-600'
          } rounded-full w-14 h-14 shadow-lg`}
        >
          {isRecording ? (
            <Square className="h-6 w-6 text-white" />
          ) : (
            <Mic className="h-6 w-6 text-white" />
          )}
        </button>
      </div>
    </div>
  );
}