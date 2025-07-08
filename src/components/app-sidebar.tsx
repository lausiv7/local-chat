'use client'

import { Button } from '@/components/ui/button'
import { Bot, Settings, Plus } from 'lucide-react'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function AppSidebar() {
  const [user, setUser] = useState<any>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google' })
  }
  const handleLogout = async () => {
    await supabase.auth.signOut()
    setMenuOpen(false)
  }

  return (
    <div className="flex flex-col h-full justify-between">
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
      <div className="p-4 border-t flex flex-col items-center">
        {!user ? (
          <button
            onClick={handleGoogleLogin}
            className="w-full bg-blue-400 text-white py-2 rounded text-sm font-medium hover:bg-blue-500 transition"
          >
            로그인
          </button>
        ) : (
          <div className="relative w-full flex flex-col items-center">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-2 w-full px-2 py-2 rounded hover:bg-gray-100"
            >
              <span className="bg-blue-500 text-white rounded-full w-7 h-7 flex items-center justify-center font-bold">
                {user.user_metadata?.name?.[0] || user.email[0]}
              </span>
              <span className="truncate max-w-[80px]">{user.user_metadata?.name || user.email}</span>
            </button>
            {menuOpen && (
              <div className="absolute bottom-10 left-0 w-48 bg-white border rounded shadow-lg z-10">
                <div className="px-4 py-2 text-sm text-gray-700 border-b">{user.email}</div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  로그아웃
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
} 