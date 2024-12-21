'use client';
import { useRouter } from 'next/navigation';
import VoiceRecognition from './VoiceRecognition';

export default function WelcomeContent() {
  const router = useRouter();

  const handleCommand = (command) => {
    if (command.includes('hey bot')) {
      router.push('/assistant');
    } else if (command.includes('go home')) {
      router.push('/home');
    }
  };

  return (
    <>
      <VoiceRecognition onCommand={handleCommand} />
      <div className="min-h-screen bg-blue-50 flex flex-col items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <div className="w-24 h-24 bg-blue-500 rounded-full mx-auto mb-6 flex items-center justify-center">
            <img src="/bank-icon.svg" alt="Bank Icon" className="w-12 h-12" />
          </div>
          <h1 className="text-3xl font-bold text-blue-600 mb-4">FinSee</h1>
          <p className="text-gray-600 mb-6">Use Headphones for Privacy</p>
          <button
            onClick={() => router.push('/home')}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Get Started
          </button>
        </div>
      </div>
    </>
  );
}
