"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import Header from "@/app/components/ui/header";
import { Chatbot } from "@/app/components/ui/chatbot";

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-gradient-to-b from-zinc-900 to-black text-white">
      <div className={`fixed inset-0 transition-all duration-300 ${!isOpen ? 'backdrop-blur-sm bg-black/50' : ''}`} />
      {isOpen ? (
        <div className="fixed inset-0 z-20 bg-zinc-900/95 backdrop-blur-sm">
          <Header />
          <Chatbot />
        </div>
      ) : (
        <>
          <div className="text-center relative z-10 space-y-6">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-700 to-blue-700 inline-block text-transparent bg-clip-text">
              👋 Hi there!
            </h1>
            <p className="text-xl text-zinc-300 leading-relaxed">
              Welcome to my interactive portfolio! I'm your personal AI assistant, ready to share insights about my creator's professional journey! 💼 <br/>
              Feel free to explore my experience in software development, dive into my projects, or learn about my technical skills. 🚀 <br/>
              Let's have a conversation and discover how I can contribute to your team! ✨
            </p>
          </div>
          <div className="relative z-10">
            <Button 
              onClick={() => setIsOpen(true)}
              className="bg-gradient-to-r from-yellow-700 to-blue-700 hover:from-yellow-600 hover:to-blue-600 text-white px-8 py-6 text-lg font-medium transition-all duration-200 hover:scale-105 rounded-3xl"
            >
              Chat with me
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
