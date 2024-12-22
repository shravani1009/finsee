"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from 'next/navigation';
import { 
  QrCode, 
  Smartphone, 
  Users, 
  Building2, 
  Wallet, 
  Headphones, 
  Mic, 
  Square,
  ArrowLeft,
  Home,
  User
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef(null);
  const initialAnnouncementMade = useRef(false);

  const bankingServices = [
    { icon: <QrCode size={24} className="text-blue-600" />, text: 'Scan QR code', route: '/scan-qr', commands: ['scan', 'scan qr', 'qr code'] },
    { icon: <Smartphone size={24} className="text-blue-600" />, text: 'Pay phone number', route: '/pay-phone', commands: ['pay phone', 'phone payment'] },
    { icon: <Users size={24} className="text-blue-600" />, text: 'Pay contacts', route: '/pay-contacts', commands: ['pay contacts', 'contact payment'] },
    { icon: <Building2 size={24} className="text-blue-600" />, text: 'Bank transfer', route: '/bank-transfer', commands: ['transfer', 'bank transfer'] },
    { icon: <Wallet size={24} className="text-blue-600" />, text: 'Check Balance', route: '/check-balance', commands: ['balance', 'check balance'] },
    { icon: <Headphones size={24} className="text-blue-600" />, text: 'Assistance', route: '/assistant', commands: ['assistance', 'help me'] }
  ];

  const speak = (text) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  const handleVoiceCommand = (command) => {
    const lowerCommand = command.toLowerCase();
    console.log("Processing command:", lowerCommand);

    if (lowerCommand.includes('help')) {
      speak("Available commands are: check balance, transfer money, scan QR code, pay contacts, pay phone number, and assistance.");
      return;
    }

    const matchedService = bankingServices.find(service =>
      service.commands.some(cmd => lowerCommand.includes(cmd))
    );

    if (matchedService) {
      speak(`Opening ${matchedService.text}`);
      router.push(matchedService.route);
    }
  };

  const startRecording = () => {
    if (!window.webkitSpeechRecognition) {
      alert("Speech recognition is not supported in this browser");
      return;
    }

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

  useEffect(() => {
    if (!initialAnnouncementMade.current) {
      const welcomeMessage = `Welcome to banking services. Available options are: ${
        bankingServices.map(service => service.text).join(', ')
      }. Say 'help' anytime to hear the commands again.`;
      
      setTimeout(() => {
        speak(welcomeMessage);
        initialAnnouncementMade.current = true;
        startRecording();
      }, 1000);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      window.speechSynthesis.cancel();
    };
  }, []);

  return (
    <div className="max-w-md mx-auto min-h-screen bg-white">
      <div className="bg-blue-600 p-4 pb-8 rounded-b-[30px]">
        <div className="flex items-center justify-between mb-2">
          <button className="p-2" onClick={() => router.back()}>
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <span className="text-white font-medium">Home</span>
          <button className="p-2">
            <User className="w-6 h-6 text-white" />
          </button>
        </div>
        <h1 className="text-xl text-white mt-4 mb-6 px-2">Banking Services</h1>
        
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="grid grid-cols-2 gap-6">
            {bankingServices.map((service, index) => (
              <button
                key={index}
                className="flex flex-col items-center gap-3 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
                onClick={() => {
                  speak(`Opening ${service.text}`);
                  router.push(service.route);
                }}
              >
                <div className="bg-white p-3 rounded-xl shadow-sm">
                  {service.icon}
                </div>
                <span className="text-sm text-gray-700 text-center leading-tight">
                  {service.text}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 mt-6">
        <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-full">
                <Headphones className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-white font-medium">FinSee</div>
                <div className="text-white/80 text-sm">Always active</div>
              </div>
            </div>
            <Mic className="w-5 h-5 text-white" />
          </div>
        </div>

        {transcript && (
          <div className="mt-4 bg-gray-50 rounded-xl p-4">
            <p className="text-sm font-medium text-gray-600">Last command:</p>
            <p className="text-sm text-gray-800">{transcript}</p>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-100">
        <div className="flex justify-around items-center p-4">
          <button>
            <Home className="w-6 h-6 text-blue-600" />
          </button>
          <div className="relative -mt-8">
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`flex items-center justify-center ${
                isRecording ? 'bg-red-500' : 'bg-blue-600'
              } rounded-full w-14 h-14 shadow-lg`}
            >
              {isRecording ? (
                <Square className="h-6 w-6 text-white" />
              ) : (
                <Mic className="h-6 h-6 text-white" />
              )}
            </button>
          </div>
          <button>
            <User className="w-6 h-6 text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
}