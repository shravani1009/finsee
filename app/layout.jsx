
// app/layout.js
import { Inter } from 'next/font/google'
import './globals.css'
import { VoiceProvider } from '../context/VoiceContext'
import { SpeechProvider } from '../context/SpeechContext';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Voice Assistant App',
  description: 'Personal voice assistant application',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SpeechProvider>
          {children}
        </SpeechProvider>
      </body>
    </html>
  );
}