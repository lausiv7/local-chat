import { useState, useRef, useCallback } from 'react'
import { nanoid } from 'nanoid'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: Date
}

export interface ChatState {
  messages: Message[]
  isLoading: boolean
  modelStatus: string
  isModelLoaded: boolean
}

export const useLocalChat = () => {
  const [state, setState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    modelStatus: 'Not initialized',
    isModelLoaded: false
  })

  const engineRef = useRef<any>(null)

  // Load messages from localStorage on mount
  const loadMessages = useCallback(() => {
    try {
      const saved = localStorage.getItem('local-chat-messages')
      if (saved) {
        const messages = JSON.parse(saved).map((msg: any) => ({
          ...msg,
          createdAt: new Date(msg.createdAt)
        }))
        setState((prev: ChatState) => ({ ...prev, messages }))
      }
    } catch (error) {
      console.error('Failed to load messages:', error)
    }
  }, [])

  // Save messages to localStorage
  const saveMessages = useCallback((messages: Message[]) => {
    try {
      localStorage.setItem('local-chat-messages', JSON.stringify(messages))
    } catch (error) {
      console.error('Failed to save messages:', error)
    }
  }, [])

  // Initialize the MLC engine
  const initializeEngine = useCallback(async () => {
    try {
      setState((prev: ChatState) => ({ ...prev, modelStatus: 'Loading model...' }))
      
      // Dynamic import to avoid SSR issues
      const { CreateMLCEngine } = await import('@mlc-ai/web-llm')
      
      const MODEL_ID = 'Llama-3.1-8B-Instruct-q4f32_1-MLC'
      
      engineRef.current = await CreateMLCEngine(MODEL_ID, {
        initProgressCallback: (progress: any) => {
          setState((prev: ChatState) => ({ 
            ...prev, 
            modelStatus: progress.text || 'Initializing...' 
          }))
        }
      })

      setState((prev: ChatState) => ({ 
        ...prev, 
        isModelLoaded: true, 
        modelStatus: 'Model ready!' 
      }))
    } catch (error) {
      console.error('Failed to initialize engine:', error)
      setState((prev: ChatState) => ({ 
        ...prev, 
        modelStatus: 'Failed to load model' 
      }))
    }
  }, [])

  // Send a message and get response
  const sendMessage = useCallback(async (content: string) => {
    if (!engineRef.current) {
      console.error('Engine not initialized')
      return
    }

    const userMessage: Message = {
      id: nanoid(),
      role: 'user',
      content,
      createdAt: new Date()
    }

    const newMessages = [...state.messages, userMessage]
    setState((prev: ChatState) => ({ ...prev, messages: newMessages, isLoading: true }))
    saveMessages(newMessages)

    try {
      const assistantMessage: Message = {
        id: nanoid(),
        role: 'assistant',
        content: '',
        createdAt: new Date()
      }

      const messagesWithAssistant = [...newMessages, assistantMessage]
      setState((prev: ChatState) => ({ ...prev, messages: messagesWithAssistant }))
      saveMessages(messagesWithAssistant)

      // Create chat completion
      const completion = await engineRef.current.chat.completions.create({
        messages: newMessages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        stream: true
      })

      let fullContent = ''
      
      for await (const chunk of completion) {
        if (chunk.choices[0]?.delta?.content) {
          fullContent += chunk.choices[0].delta.content
          
          // Update the assistant message with streaming content
          const updatedMessages = messagesWithAssistant.map(msg => 
            msg.id === assistantMessage.id 
              ? { ...msg, content: fullContent }
              : msg
          )
          
          setState((prev: ChatState) => ({ ...prev, messages: updatedMessages }))
          saveMessages(updatedMessages)
        }
      }

      setState((prev: ChatState) => ({ ...prev, isLoading: false }))
    } catch (error) {
      console.error('Failed to get response:', error)
      setState((prev: ChatState) => ({ ...prev, isLoading: false }))
    }
  }, [state.messages, saveMessages])

  // Clear all messages
  const clearMessages = useCallback(() => {
    setState((prev: ChatState) => ({ ...prev, messages: [] }))
    localStorage.removeItem('local-chat-messages')
  }, [])

  return {
    ...state,
    initializeEngine,
    sendMessage,
    clearMessages,
    loadMessages
  }
} 