'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Bot, Settings, Plus, Trash2, Edit3, Check, X } from 'lucide-react'
import { Conversation } from '@/lib/db'

interface EnhancedSidebarProps {
  conversations: Conversation[]
  currentConversationId: string | null
  onCreateConversation: () => void
  onSelectConversation: (id: string) => void
  onDeleteConversation: (id: string) => void
  onUpdateConversationTitle: (id: string, title: string) => void
}

export function EnhancedSidebar({
  conversations,
  currentConversationId,
  onCreateConversation,
  onSelectConversation,
  onDeleteConversation,
  onUpdateConversationTitle
}: EnhancedSidebarProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')

  const handleEditStart = (conversation: Conversation) => {
    setEditingId(conversation.id)
    setEditTitle(conversation.title)
  }

  const handleEditSave = () => {
    if (editingId && editTitle.trim()) {
      onUpdateConversationTitle(editingId, editTitle.trim())
    }
    setEditingId(null)
    setEditTitle('')
  }

  const handleEditCancel = () => {
    setEditingId(null)
    setEditTitle('')
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  return (
    <div className="w-64 border-r bg-background flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center space-x-2">
          <Bot className="w-6 h-6" />
          <span className="font-semibold">Local Chat</span>
        </div>
      </div>
      
      <div className="flex-1 p-4 space-y-2">
        <Button 
          className="w-full justify-start" 
          variant="outline"
          onClick={onCreateConversation}
        >
          <Plus className="w-4 h-4 mr-2" />
          New Chat
        </Button>
        
        <div className="space-y-1">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`group relative flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-accent ${
                currentConversationId === conversation.id ? 'bg-accent' : ''
              }`}
              onClick={() => onSelectConversation(conversation.id)}
            >
              {editingId === conversation.id ? (
                <div className="flex-1 flex items-center space-x-2">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleEditSave()}
                    className="flex-1 bg-transparent border-none outline-none text-sm"
                    autoFocus
                  />
                  <Button size="sm" variant="ghost" onClick={handleEditSave}>
                    <Check className="w-3 h-3" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={handleEditCancel}>
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">
                      {conversation.title}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatDate(conversation.updatedAt)}
                    </div>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 flex space-x-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEditStart(conversation)
                      }}
                    >
                      <Edit3 className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation()
                        onDeleteConversation(conversation.id)
                      }}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="p-4 border-t">
        <Button className="w-full justify-start" variant="ghost" size="sm">
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </Button>
      </div>
    </div>
  )
} 