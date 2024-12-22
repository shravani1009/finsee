"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function FinSeeAssistant() {
  const router = useRouter();
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [messages, setMessages] = useState([]);
  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);
  const initialAnnouncementMade = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!initialAnnouncementMade.current) {
      const welcomeMessage =
        "Hello! I'm FinSee, your AI financial advisor specialized in Indian markets. How can I help you with your financial planning today?";
      setMessages([{ type: "assistant", text: welcomeMessage }]);
      speak(welcomeMessage);
      initialAnnouncementMade.current = true;

      setTimeout(() => {
        startRecording();
      }, 2000);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      window.speechSynthesis.cancel();
    };
  }, []);

  const speak = (text) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    utterance.onend = () => {
      console.log("Finished speaking");
      if (!isRecording) {
        startRecording();
      }
    };
    window.speechSynthesis.speak(utterance);
  };

  const handleQuery = async (query) => {
    if (!query.trim()) return;

    setIsLoading(true);
    stopRecording(); // Stop recording while processing

    try {
      setMessages((prev) => [...prev, { type: "user", text: query }]);

      // Make API call to Groq
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from AI');
      }

      const data = await response.json();
      const aiResponse = data.response;

      setMessages((prev) => [
        ...prev,
        { type: "assistant", text: aiResponse },
      ]);
      speak(aiResponse);

    } catch (error) {
      console.error("Chat Error:", error);
      const errorMessage = "I apologize, but I encountered an error. Please try asking your question again.";
      setMessages((prev) => [
        ...prev,
        { type: "assistant", text: errorMessage },
      ]);
      speak(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const restartRecording = () => {
    if (isRecording && !isLoading) {
      try {
        setTimeout(() => {
          recognitionRef.current?.start();
        }, 100);
      } catch (error) {
        console.error("Error restarting recognition:", error);
      }
    }
  };

  const startRecording = () => {
    if (!window.webkitSpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please use Chrome.");
      return;
    }

    try {
      recognitionRef.current = new window.webkitSpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-IN'; // Set to Indian English

      recognitionRef.current.onstart = () => {
        console.log("Voice recognition started");
        setIsRecording(true);
      };

      recognitionRef.current.onresult = (event) => {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;
        
        if (event.results[current].isFinal) {
          console.log("Final transcript:", transcript);
          handleQuery(transcript);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        if (event.error !== 'no-speech') {
          restartRecording();
        }
      };

      recognitionRef.current.onend = () => {
        console.log("Recognition ended");
        if (isRecording && !isLoading) {
          restartRecording();
        }
      };

      recognitionRef.current.start();
    } catch (error) {
      console.error("Error starting recognition:", error);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-white flex flex-col">
      <div className="bg-blue-600 p-4 pb-6 rounded-b-[30px]">
        <div className="flex items-center justify-between mb-2">
          <button 
            className="p-2" 
            onClick={() => {
              stopRecording();
              router.back();
            }}
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <span className="text-white font-medium">FinSee AI Assistant</span>
          <div className="w-6 h-6" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.type === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {message.type === "assistant" && (
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
            )}
            <div
              className={`max-w-[75%] rounded-lg p-3 ${
                message.type === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100"
              }`}
            >
              <p className="whitespace-pre-line">{message.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-3">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 flex justify-center">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isLoading}
          className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
            isRecording
              ? "bg-red-500"
              : isLoading
              ? "bg-gray-400"
              : "bg-blue-500 hover:bg-blue-600"
          } shadow-lg`}
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
  );
}