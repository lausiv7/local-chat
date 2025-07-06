'use client'

import { Button } from '@/components/ui/button'
import { Bot, Settings, Plus } from 'lucide-react'

export function AppSidebar() {
  return (
    <div className="w-64 border-r bg-background flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center space-x-2">
          <Bot className="w-6 h-6" />
          <span className="font-semibold">Local Chat</span>
        </div>
      </div>
      
      <div className="flex-1 p-4">
        <Button className="w-full justify-start" variant="outline">
          <Plus className="w-4 h-4 mr-2" />
          New Chat
        </Button>
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