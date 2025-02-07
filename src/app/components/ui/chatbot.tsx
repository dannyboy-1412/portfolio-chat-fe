'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from './button'
import { Input } from './input'
import { Loader2, Bot} from 'lucide-react'
import { ScrollArea } from './scroll'
import { getCompletions, Message, sendTelegramMessage } from '@/shared/api'
import Markdown from 'react-markdown'
import { useRefreshChatKeyHandler } from '@/hooks/refreshChatKeyHandler'
import remarkGfm from 'remark-gfm'

export function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [parentId, setParentId] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  const handleRefreshChat = () => {
    setMessages([]);
    setInputMessage('');
    setParentId(null);
  }


  useRefreshChatKeyHandler(handleRefreshChat, 'k');

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) {
      return ;
    }
    const userMessageId = crypto.randomUUID();
    const newMessage: Message = {
      id: userMessageId,
      content: inputMessage,
      role: 'user',
    };

    if (parentId) {
      newMessage.parent_id = parentId;
    };

    let completeAssistantMessage = '';
    const input = inputMessage;
    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    setIsLoading(true);
    setIsStreaming(true);

    try {
      const reader = await getCompletions(newMessage)
      let assistantMessageId: string | null = null
      const decoder = new TextDecoder()

      const initialAssistantMessage: Message = {
        id: '',
        role: 'assistant',
        content: '',
      }
      setMessages(prev => [...prev, initialAssistantMessage])

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('/&')
        if (lines.length < 2) continue

        for (const line of lines) {
          if (line.trim() === '') continue
          if (line.includes('data:')) {
            const data = JSON.parse(line.split('data: ')[1])
            if (data?.content) {
              setIsStreaming(false)
              setIsLoading(false)
              const { content } = data
              if (content) {
                completeAssistantMessage += content
                setMessages(prev => {
                  const lastMessage = prev[prev.length - 1];
                  if (lastMessage.role === 'assistant') {
                    return [
                      ...prev.slice(0, -1),
                      { ...lastMessage, content: lastMessage.content + content }
                    ];
                  }
                  return prev;
                });
              }
            } else if (data?.assistant_message_id) {
              assistantMessageId = data?.assistant_message_id
              if (assistantMessageId) {
                setParentId(assistantMessageId)
                setMessages(prev => prev.map(msg => 
                  msg.id === '' ? { ...msg, id: assistantMessageId! } : msg
                ))
              }
            }
          }
        }
      }

      decoder.decode()

      try {
        await sendTelegramMessage({
          user_message: input,
          assistant_message: completeAssistantMessage
        })
      } catch (error) {
        console.error('Error sending Telegram message:', error)
      }


      setIsStreaming(false)
      setIsLoading(false)
      
      inputRef.current?.focus()

    } catch (error) {
      console.error('Error during streaming:', error)
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-[85vh] w-full max-w-2xl mx-auto bg-zinc-900 backdrop-blur-sm">
      {messages.length > 0 ? (
        <>
          <ScrollArea className="flex-1 p-4 pb-24 space-y-4">
            <div className="space-y-4 flex flex-col">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="mt-3 mr-2">
                      <Bot size={20}/>
                    </div>
                  )}
                  <div
                    className={`inline-block max-w-[95%] rounded-2xl p-3 shadow-lg backdrop-blur-sm ${
                      message.role === 'user'
                        ? 'bg-gradient-to-br from-zinc-800/90 to-zinc-800/70 text-zinc-100'
                        : 'bg-gradient-to-br from-zinc-900/90 to-zinc-900/70 text-zinc-300'
                    }`}
                  >
                    <Markdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        p: ({ children }) => <p className="mb-1">{children}</p>,
                        h1: ({ children }) => <h1 className="text-2xl font-bold mb-2">{children}</h1>,
                        h2: ({ children }) => <h2 className="text-xl font-bold mb-2">{children}</h2>,
                        h3: ({ children }) => <h3 className="text-lg font-bold mb-2">{children}</h3>,
                        ul: ({ children }) => <ul className="list-disc ml-6 mb-2">{children}</ul>,
                        li: ({ children }) => <li className="mb-1">{children}</li>,
                        blockquote: ({ children }) => (
                          <blockquote className="border-l-4 border-gray-200 pl-4 mb-2">{children}</blockquote>
                        ),
                      }}
                    >
                      {message.content}
                    </Markdown>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  {isStreaming && (
                    <div className="mt-3 mr-2">
                      <Bot size={20}/>
                    </div>
                  )}
                  <div className="bg-gradient-to-br from-zinc-900/90 to-zinc-900/70 rounded-2xl p-3 shadow-lg backdrop-blur-sm">
                    <Loader2 className="h-5 w-5 animate-spin text-zinc-400" />
                  </div>
                </div>
              )}
            </div>
            <div ref={scrollRef}></div>
          </ScrollArea>

          {/* Updated Input Area when messages exist */}
          <div className="sticky bottom-0 w-full bg-zinc-800/95 border-t border-zinc-700/50 rounded-2xl">
            <div className="max-w-2xl mx-auto px-4 py-3">
              <div className="flex items-center gap-2">
                <Input
                  ref={inputRef}
                  placeholder="Press Ctrl/Cmd + K to refresh chat"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                  className="flex-1 bg-zinc-700/50 border-zinc-600 focus:border-zinc-500 
                    transition-all duration-200 
                    text-zinc-100 placeholder:text-zinc-400
                    hover:bg-zinc-700/70 focus:bg-zinc-700/90
                    rounded-2xl px-4 py-2"
                />
              </div>
            </div>
          </div>
        </>
      ) : (
        // Centered Input Area when no messages
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="w-full max-w-xl space-y-6">
            <div className="text-center space-y-4">

              <h2 className="text-xl font-semibold text-zinc-100">How can I help you today?</h2>
              <div className="flex flex-wrap gap-2 justify-center">
                <Button
                  variant="outline"
                  className="bg-zinc-800/50 hover:bg-zinc-700/50 text-zinc-300"
                  onClick={() => {
                    setInputMessage("How many years of experience do you have?")
                    inputRef.current?.focus()
                  }}
                >
                  How many years of experience do you have?
                </Button>

                <Button
                  variant="outline"
                  className="bg-zinc-800/50 hover:bg-zinc-700/50 text-zinc-300"
                  onClick={() => {
                    setInputMessage("What companies have you worked for?")
                    inputRef.current?.focus()
                  }}
                >
                  What companies have you worked for?
                </Button>


                <Button
                  variant="outline"
                  className="bg-zinc-800/50 hover:bg-zinc-700/50 text-zinc-300"
                  onClick={() => {
                    setInputMessage("What is your education background?")
                    inputRef.current?.focus()
                  }}
                >
                  What is your education background?
                </Button>


              </div>
            </div>
            <Input
              ref={inputRef}
              placeholder="Type a message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage()
                }
              }}
              className="w-full bg-zinc-700/50 border-zinc-600 focus:border-zinc-500 
                transition-all duration-200 
                text-zinc-100 placeholder:text-zinc-400
                hover:bg-zinc-700/70 focus:bg-zinc-700/90
                rounded-2xl px-4 py-2"
            />
          </div>
        </div>
      )}
    </div>
  )
}
