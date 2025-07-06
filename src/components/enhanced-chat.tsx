'use client'

import { useState } from 'react'
import { ChatMessages } from './chat/chat-messages'
import { ChatInput } from './chat/chat-input'
import { Settings } from './settings'
import { useEnhancedChat } from '@/hooks/use-enhanced-chat'

export function EnhancedChat() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  
  const {
    messages,
    conversations,
    currentConversationId,
    isLoading,
    modelStatus,
    isModelLoaded,
    initializeEngine,
    sendMessage,
    clearMessages,
    loadConversation,
    createConversation,
    deleteConversation,
    updateConversationTitle
  } = useEnhancedChat()

  const handleClearAllData = () => {
    // Clear IndexedDB
    indexedDB.deleteDatabase('local-chat-db')
    // Clear localStorage
    localStorage.clear()
    // Reload page
    window.location.reload()
  }

  return (
    <>
      <div className="flex h-screen">
        <div className="w-64 border-r bg-background flex flex-col">
          <div className="p-4 border-b">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                <span className="text-primary-foreground text-sm font-bold">LC</span>
              </div>
              <span className="font-semibold">Local Chat</span>
            </div>
          </div>
          
          <div className="flex-1 p-4 space-y-2">
            <button 
              className="w-full text-left p-2 rounded-md hover:bg-accent text-sm font-medium"
              onClick={createConversation}
            >
              + New Chat
            </button>
            
            <div className="space-y-1">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`group relative flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-accent text-sm ${
                    currentConversationId === conversation.id ? 'bg-accent' : ''
                  }`}
                  onClick={() => loadConversation(conversation.id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="truncate">
                      {conversation.title}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(conversation.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <button
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive hover:text-destructive-foreground rounded"
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteConversation(conversation.id)
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          <div className="p-4 border-t">
            <button 
              className="w-full text-left p-2 rounded-md hover:bg-accent text-sm"
              onClick={() => setIsSettingsOpen(true)}
            >
              Settings
            </button>
          </div>
        </div>
        
        <main className="flex-1 flex flex-col">
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
        </main>
      </div>
      
      <Settings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onInitializeModel={initializeEngine}
        onClearData={handleClearAllData}
        modelStatus={modelStatus}
        isModelLoaded={isModelLoaded}
      />
    </>
  )
} 