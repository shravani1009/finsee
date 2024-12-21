
// app/page.js (Welcome Page)
import Link from 'next/link'

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-purple-600 flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-8">Welcome to FinSee</h1>
        <p className="text-xl text-white mb-8">Your personal voice assistant for banking</p>
        <Link 
          href="/home" 
          className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition-colors"
        >
          Get Started
        </Link>
      </div>
    </div>
  )
}
