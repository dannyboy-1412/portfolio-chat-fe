'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { getCompletions, Message } from '@/shared/api'
import { consumeCompletionStreamChunk } from '@/lib/parseCompletionStream'
import { useRefreshChatKeyHandler } from '@/hooks/refreshChatKeyHandler'

export type UseChatThreadResult = {
  messages: Message[]
  inputMessage: string
  setInputMessage: (value: string) => void
  isLoading: boolean
  isStreaming: boolean
  sendMessage: (content?: string) => Promise<void>
  clearChat: () => void
  inputRef: React.RefObject<HTMLInputElement | null>
  scrollContainerRef: React.RefObject<HTMLDivElement | null>
}

export function useChatThread(): UseChatThreadResult {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [parentId, setParentId] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const parentIdRef = useRef<string | null>(null)
  const isLoadingRef = useRef(false)

  useEffect(() => {
    parentIdRef.current = parentId
  }, [parentId])

  useEffect(() => {
    isLoadingRef.current = isLoading
  }, [isLoading])

  const scrollToBottom = useCallback(() => {
    const el = scrollContainerRef.current
    if (el) {
      el.scrollTop = el.scrollHeight
    }
  }, [])

  const clearChat = useCallback(() => {
    setMessages([])
    setInputMessage('')
    setParentId(null)
  }, [])

  useRefreshChatKeyHandler(clearChat, 'k')

  const sendMessage = useCallback(
    async (content?: string) => {
      const text = (content ?? inputMessage).trim()
      if (!text || isLoadingRef.current) {
        return
      }

      const userMessageId = crypto.randomUUID()
      const newMessage: Message = {
        id: userMessageId,
        content: text,
        role: 'user',
      }

      if (parentIdRef.current) {
        newMessage.parent_id = parentIdRef.current
      }

      setMessages((prev) => [...prev, newMessage])
      setInputMessage('')
      setIsLoading(true)
      setIsStreaming(true)

      requestAnimationFrame(scrollToBottom)

      try {
        const reader = await getCompletions(newMessage)
        const decoder = new TextDecoder()
        let buffer = ''

        const initialAssistantMessage: Message = {
          id: '',
          role: 'assistant',
          content: '',
        }
        setMessages((prev) => [...prev, initialAssistantMessage])

        const applyStreamPayload = (data: {
          content?: string
          assistant_message_id?: string
        }) => {
          if (data.content) {
            setIsStreaming(false)
            setIsLoading(false)
            setMessages((prev) => {
              const lastMessage = prev[prev.length - 1]
              if (lastMessage.role === 'assistant') {
                return [
                  ...prev.slice(0, -1),
                  { ...lastMessage, content: lastMessage.content + data.content },
                ]
              }
              return prev
            })
            requestAnimationFrame(scrollToBottom)
            return
          }

          if (data.assistant_message_id) {
            const assistantMessageId = data.assistant_message_id
            setParentId(assistantMessageId)
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === '' ? { ...msg, id: assistantMessageId } : msg
              )
            )
          }
        }

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const { buffer: nextBuffer, payloads } = consumeCompletionStreamChunk(
            buffer,
            decoder.decode(value, { stream: true })
          )
          buffer = nextBuffer

          for (const payload of payloads) {
            applyStreamPayload(payload)
          }
        }

        decoder.decode()
        setIsStreaming(false)
        setIsLoading(false)
        inputRef.current?.focus()
      } catch (error) {
        console.error('Error during streaming:', error)
        setIsLoading(false)
        setIsStreaming(false)
      }
    },
    [inputMessage, scrollToBottom]
  )

  return {
    messages,
    inputMessage,
    setInputMessage,
    isLoading,
    isStreaming,
    sendMessage,
    clearChat,
    inputRef,
    scrollContainerRef,
  }
}
