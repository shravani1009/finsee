"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef(null);
  const router = useRouter();
  const initialAnnouncementMade = useRef(false);

  // Banking services with their voice commands
  const bankingServices = [
    { icon: '🔍', text: 'Scan QR code', route: '/scan-qr', commands: ['scan', 'scan qr', 'qr code'] },
    { icon: '📱', text: 'Pay phone number', route: '/pay-phone', commands: ['pay phone', 'phone payment'] },
    { icon: '👥', text: 'Pay contacts', route: '/pay-contacts', commands: ['pay contacts', 'contact payment'] },
    { icon: '🏦', text: 'Bank transfer', route: '/bank-transfer', commands: ['transfer', 'bank transfer'] },
    { icon: '💰', text: 'Check Balance', route: '/check-balance', commands: ['balance', 'check balance'] },
    { icon: '👥', text: 'Assistance', route: '/assistant', commands: ['assistance', 'assistant'] },
  ];

  // Text-to-speech function
  const speak = (text) => {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  // Initial announcement when page loads
  useEffect(() => {
    if (!initialAnnouncementMade.current) {
      const welcomeMessage = `Welcome to banking services. Available options are: ${
        bankingServices.map(service => service.text).join(', ')
      }. Say 'help' anytime to hear the commands again.`;
      
      // Small delay to ensure speech synthesis is ready
      setTimeout(() => {
        speak(welcomeMessage);
        initialAnnouncementMade.current = true;
        // Automatically start listening after the welcome message
        startRecording();
      }, 1000);
    }
  }, []);

  // Handle voice commands
  const handleVoiceCommand = (command) => {
    const lowerCommand = command.toLowerCase();

    // Help command
    if (lowerCommand.includes('help')) {
      speak("Available commands are: check balance, transfer money, scan QR code, pay contacts, pay phone number.");
      return;
    }

    // Check for matching service commands
    const matchedService = bankingServices.find(service =>
      service.commands.some(cmd => lowerCommand.includes(cmd))
    );

    if (matchedService) {
      speak(`Opening ${matchedService.text}`);
      router.push(matchedService.route);
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    recognitionRef.current = new window.webkitSpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;

    recognitionRef.current.onstart = () => {
      // Don't announce anything on start to avoid interrupting the user
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
      // Attempt to restart recognition after error
      setTimeout(startRecording, 1000);
    };

    recognitionRef.current.onend = () => {
      // Automatically restart recognition if it ends
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

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      window.speechSynthesis.cancel();
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold text-blue-600 mb-6">Banking Services</h1>

        {/* Banking Services Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {bankingServices.map((service, index) => (
            <div
              key={index}
              className="bg-blue-50 p-4 rounded-lg text-center hover:bg-blue-100 transition-colors cursor-pointer"
              onClick={() => {
                router.push(service.route);
              }}
              // Remove onMouseEnter to avoid interrupting voice commands
            >
              <div className="text-2xl mb-2">{service.icon}</div>
              <div className="text-sm font-medium text-blue-800">{service.text}</div>
            </div>
          ))}
        </div>

        {/* Voice Command Transcript */}
        {transcript && (
          <div className="w-full rounded-md border p-4 bg-white mb-4">
            <p className="text-sm font-medium">Last command:</p>
            <p className="text-sm text-gray-600">{transcript}</p>
          </div>
        )}

        {/* Microphone Control */}
        <div className="fixed bottom-4 right-4">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`flex items-center justify-center ${
              isRecording ? 'bg-red-400 hover:bg-red-500' : 'bg-blue-400 hover:bg-blue-500'
            } rounded-full w-16 h-16 focus:outline-none`}
          >
            {isRecording ? (
              <svg className="h-8 w-8" viewBox="0 0 24 24">
                <path fill="white" d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              <svg viewBox="0 0 256 256" className="w-8 h-8 text-white">
                <path
                  fill="currentColor"
                  d="M128 176a48.05 48.05 0 0 0 48-48V64a48 48 0 0 0-96 0v64a48.05 48.05 0 0 0 48 48ZM96 64a32 32 0 0 1 64 0v64a32 32 0 0 1-64 0Zm40 143.6V232a8 8 0 0 1-16 0v-24.4A80.11 80.11 0 0 1 48 128a8 8 0 0 1 16 0a64 64 0 0 0 128 0a8 8 0 0 1 16 0a80.11 80.11 0 0 1-72 79.6Z"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}