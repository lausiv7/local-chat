'use client'

import { Button } from '@/components/ui/button'
import { Message } from '@/hooks/use-local-chat'
import { Bot, User, Download, Trash2 } from 'lucide-react'

interface ChatMessagesProps {
  messages: Message[]
  isLoading: boolean
  modelStatus: string
  isModelLoaded: boolean
  onInitialize: () => void
  onClear: () => void
}

export function ChatMessages({
  messages,
  isLoading,
  modelStatus,
  isModelLoaded,
  onInitialize,
  onClear
}: ChatMessagesProps) {
  if (!isModelLoaded) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-4">
          <div className="text-2xl font-bold">Local Chat</div>
          <div className="text-muted-foreground">
            Initialize the AI model to start chatting
          </div>
          <div className="text-sm text-muted-foreground">
            {modelStatus}
          </div>
          <Button onClick={onInitialize} disabled={isLoading}>
            <Download className="w-4 h-4 mr-2" />
            Initialize Model
          </Button>
        </div>
      </div>
    )
  }

  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-4">
          <div className="text-2xl font-bold">Start a conversation</div>
          <div className="text-muted-foreground">
            Send a message to begin chatting with the AI
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`flex items-start space-x-2 max-w-[80%] ${
                message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                {message.role === 'user' ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
              </div>
              <div
                className={`rounded-lg px-4 py-2 ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-2 max-w-[80%]">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-muted rounded-lg px-4 py-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {messages.length > 0 && (
        <div className="border-t p-4">
          <Button variant="outline" size="sm" onClick={onClear}>
            <Trash2 className="w-4 h-4 mr-2" />
            Clear Chat
          </Button>
        </div>
      )}
    </div>
  )
} 