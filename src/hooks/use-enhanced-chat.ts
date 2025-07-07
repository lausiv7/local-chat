import { useState, useRef, useCallback, useEffect } from 'react'
import { nanoid } from 'nanoid'
import { Message } from './use-local-chat'
import { db, Conversation } from '@/lib/db'

export interface ChatState {
  messages: Message[]
  conversations: Conversation[]
  currentConversationId: string | null
  isLoading: boolean
  modelStatus: string
  isModelLoaded: boolean
}

export const useEnhancedChat = () => {
  const [state, setState] = useState<ChatState>({
    messages: [],
    conversations: [],
    currentConversationId: null,
    isLoading: false,
    modelStatus: 'Not initialized',
    isModelLoaded: false
  })

  const engineRef = useRef<any>(null)

  // Initialize database and load conversations
  useEffect(() => {
    const initDb = async () => {
      try {
        await db.init()
        const conversations = await db.getConversations()
        setState((prev: ChatState) => ({ ...prev, conversations }))
        
        // Load the most recent conversation if available
        if (conversations.length > 0) {
          await loadConversation(conversations[0].id)
        }
      } catch (error) {
        console.error('Failed to initialize database:', error)
      }
    }
    
    initDb()
  }, [])

  // Load messages for a specific conversation
  const loadConversation = useCallback(async (conversationId: string) => {
    try {
      const messages = await db.getMessages(conversationId)
      setState((prev: ChatState) => ({ 
        ...prev, 
        messages, 
        currentConversationId: conversationId 
      }))
    } catch (error) {
      console.error('Failed to load conversation:', error)
    }
  }, [])

  // Create a new conversation
  const createConversation = useCallback(async (title: string = 'New Chat') => {
    const conversationId = nanoid()
    const conversation: Conversation = {
      id: conversationId,
      title,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    try {
      await db.saveConversation(conversation)
      setState((prev: ChatState) => ({ 
        ...prev, 
        conversations: [conversation, ...prev.conversations],
        messages: [],
        currentConversationId: conversationId
      }))
    } catch (error) {
      console.error('Failed to create conversation:', error)
    }
  }, [])

  // Delete a conversation
  const deleteConversation = useCallback(async (conversationId: string) => {
    try {
      await db.deleteConversation(conversationId)
      setState((prev: ChatState) => {
        const newConversations = prev.conversations.filter(c => c.id !== conversationId)
        const newCurrentId = prev.currentConversationId === conversationId 
          ? (newConversations[0]?.id || null)
          : prev.currentConversationId
        
        return {
          ...prev,
          conversations: newConversations,
          currentConversationId: newCurrentId,
          messages: newCurrentId ? prev.messages : []
        }
      })

      // Load the new current conversation
      if (state.currentConversationId !== conversationId) {
        await loadConversation(state.currentConversationId!)
      }
    } catch (error) {
      console.error('Failed to delete conversation:', error)
    }
  }, [loadConversation, state.currentConversationId])

  // Update conversation title
  const updateConversationTitle = useCallback(async (conversationId: string, title: string) => {
    try {
      const conversation = state.conversations.find(c => c.id === conversationId)
      if (conversation) {
        const updatedConversation = { ...conversation, title, updatedAt: new Date() }
        await db.saveConversation(updatedConversation)
        setState((prev: ChatState) => ({
          ...prev,
          conversations: prev.conversations.map(c => 
            c.id === conversationId ? updatedConversation : c
          )
        }))
      }
    } catch (error) {
      console.error('Failed to update conversation title:', error)
    }
  }, [state.conversations])

  // Save messages to current conversation
  const saveMessages = useCallback(async (messages: Message[]) => {
    if (!state.currentConversationId) return

    try {
      await db.saveMessages(state.currentConversationId, messages)
      
      // Update conversation timestamp
      const conversation = state.conversations.find(c => c.id === state.currentConversationId)
      if (conversation) {
        const updatedConversation = { ...conversation, updatedAt: new Date() }
        await db.saveConversation(updatedConversation)
        setState((prev: ChatState) => ({
          ...prev,
          conversations: prev.conversations.map(c => 
            c.id === state.currentConversationId ? updatedConversation : c
          )
        }))
      }
    } catch (error) {
      console.error('Failed to save messages:', error)
    }
  }, [state.currentConversationId, state.conversations])

  // Initialize the MLC engine
  const initializeEngine = useCallback(async () => {
    try {
      setState((prev: ChatState) => ({ ...prev, modelStatus: 'Loading model...' }))
      
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

    // Create conversation if none exists
    if (!state.currentConversationId) {
      await createConversation()
    }

    const userMessage: Message = {
      id: nanoid(),
      role: 'user',
      content,
      createdAt: new Date()
    }

    const newMessages = [...state.messages, userMessage]
    setState((prev: ChatState) => ({ ...prev, messages: newMessages, isLoading: true }))
    await saveMessages(newMessages)

    try {
      const assistantMessage: Message = {
        id: nanoid(),
        role: 'assistant',
        content: '',
        createdAt: new Date()
      }

      const messagesWithAssistant = [...newMessages, assistantMessage]
      setState((prev: ChatState) => ({ ...prev, messages: messagesWithAssistant }))
      await saveMessages(messagesWithAssistant)

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
          await saveMessages(updatedMessages)
        }
      }

      setState((prev: ChatState) => ({ ...prev, isLoading: false }))
    } catch (error) {
      console.error('Failed to get response:', error)
      setState((prev: ChatState) => ({ ...prev, isLoading: false }))
    }
  }, [state.messages, state.currentConversationId, createConversation, saveMessages])

  // Clear current conversation messages
  const clearMessages = useCallback(async () => {
    if (!state.currentConversationId) return

    setState((prev: ChatState) => ({ ...prev, messages: [] }))
    await saveMessages([])
  }, [state.currentConversationId, saveMessages])

  return {
    ...state,
    initializeEngine,
    sendMessage,
    clearMessages,
    loadConversation,
    createConversation,
    deleteConversation,
    updateConversationTitle
  }
} 