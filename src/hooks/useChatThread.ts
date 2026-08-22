'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { track } from '@vercel/analytics'
import { getCompletions, Message } from '@/shared/api'
import { consumeCompletionStreamChunk } from '@/lib/parseCompletionStream'
import { useRefreshChatKeyHandler } from '@/hooks/refreshChatKeyHandler'

export type ChatContextType = 'project' | 'experience'

export type ChatContext = {
  type: ChatContextType
  id: string
}

export type OpenChatOptions = {
  context?: ChatContext | null
  prompt?: string
}

export type UseChatThreadResult = {
  messages: Message[]
  inputMessage: string
  setInputMessage: (value: string) => void
  isLoading: boolean
  isStreaming: boolean
  error: string | null
  sendMessage: (content?: string) => Promise<void>
  retry: () => Promise<void>
  clearChat: () => void
  inputRef: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null>
  scrollContainerRef: React.RefObject<HTMLDivElement | null>
  isOpen: boolean
  openChat: (options?: OpenChatOptions) => void
  closeChat: () => void
  context: ChatContext | null
}

export function useChatThread(): UseChatThreadResult {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [parentId, setParentId] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [context, setContext] = useState<ChatContext | null>(null)
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const parentIdRef = useRef<string | null>(null)
  const isLoadingRef = useRef(false)
  const contextRef = useRef<ChatContext | null>(null)
  const lastUserContentRef = useRef<string | null>(null)

  useEffect(() => {
    parentIdRef.current = parentId
  }, [parentId])

  useEffect(() => {
    isLoadingRef.current = isLoading
  }, [isLoading])

  useEffect(() => {
    contextRef.current = context
  }, [context])

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
    setError(null)
    setContext(null)
  }, [])

  useRefreshChatKeyHandler(clearChat, 'k')

  const runSend = useCallback(
    async (text: string, userMessageId: string) => {
      const newMessage: Message = {
        id: userMessageId,
        content: text,
        role: 'user',
      }

      if (parentIdRef.current) {
        newMessage.parent_id = parentIdRef.current
      }
      if (contextRef.current) {
        newMessage.context_type = contextRef.current.type
        newMessage.context_id = contextRef.current.id
      }

      setIsLoading(true)
      setIsStreaming(true)
      setError(null)

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
      } catch (err) {
        console.error('Error during streaming:', err)
        setIsLoading(false)
        setIsStreaming(false)
        setError(
          'Something went wrong while generating the response.'
        )
        setMessages((prev) => {
          const lastMessage = prev[prev.length - 1]
          if (lastMessage && lastMessage.role === 'assistant' && !lastMessage.content) {
            return prev.slice(0, -1)
          }
          return prev
        })
      }
    },
    [scrollToBottom]
  )

  const sendMessage = useCallback(
    async (content?: string) => {
      const text = (content ?? inputMessage).trim()
      if (!text || isLoadingRef.current) {
        return
      }

      const userMessageId = crypto.randomUUID()
      lastUserContentRef.current = text
      track('chat_message', contextRef.current ?? undefined)

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

      await runSend(text, userMessageId)
    },
    [inputMessage, runSend]
  )

  const retry = useCallback(async () => {
    const text = lastUserContentRef.current
    if (!text || isLoadingRef.current) {
      return
    }
    setMessages((prev) => {
      const last = prev[prev.length - 1]
      if (last && last.role === 'assistant' && !last.content) {
        return prev.slice(0, -1)
      }
      return prev
    })
    const userMessageId = crypto.randomUUID()
    await runSend(text, userMessageId)
  }, [runSend])

  const openChat = useCallback(
    (options?: OpenChatOptions) => {
      setIsOpen(true)
      if (options?.context !== undefined) {
        setContext(options.context)
      }
      if (options?.prompt) {
        void sendMessage(options.prompt)
      } else {
        requestAnimationFrame(() => inputRef.current?.focus())
      }
    },
    [sendMessage]
  )

  const closeChat = useCallback(() => {
    setIsOpen(false)
  }, [])

  return {
    messages,
    inputMessage,
    setInputMessage,
    isLoading,
    isStreaming,
    error,
    sendMessage,
    retry,
    clearChat,
    inputRef,
    scrollContainerRef,
    isOpen,
    openChat,
    closeChat,
    context,
  }
}
