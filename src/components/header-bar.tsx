import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function HeaderBar() {
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
    <header className="w-full flex items-center justify-end px-6 py-3 border-b bg-white shadow-sm relative z-20">
      {!user ? (
        <button
          onClick={handleGoogleLogin}
          className="flex items-center gap-2 px-4 py-2 bg-blue-400 text-white rounded font-medium hover:bg-blue-500 transition"
        >
          <span className="text-lg">→</span> Login
        </button>
      ) : (
        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100"
          >
            <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
              {user.user_metadata?.name?.[0] || user.email[0]}
            </span>
            <span className="truncate max-w-[120px]">{user.user_metadata?.name || user.email}</span>
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border rounded shadow-lg z-30">
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
    </header>
  )
} 