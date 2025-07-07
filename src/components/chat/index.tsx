'use client'

import { useEffect } from 'react'
import { ChatMessages } from './chat-messages'
import { ChatInput } from './chat-input'
import { useLocalChat } from '@/hooks/use-local-chat'

export function Chat() {
  const {
    messages,
    isLoading,
    modelStatus,
    isModelLoaded,
    initializeEngine,
    sendMessage,
    clearMessages,
    loadMessages
  } = useLocalChat()

  useEffect(() => {
    loadMessages()
  }, [loadMessages])

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-hidden">
        <ChatMessages 
          messages={messages}
          isLoading={isLoading}
          modelStatus={modelStatus}
          isModelLoaded={isModelLoaded}
          onInitialize={initializeEngine}
          onClear={clearMessages}
        />
      </div>
      <ChatInput 
        onSendMessage={sendMessage}
        isLoading={isLoading}
        isModelLoaded={isModelLoaded}
      />
    </div>
  )
} 