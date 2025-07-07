'use client'

import { useState, useEffect } from 'react'
import { EnhancedChat } from '@/components/enhanced-chat'
import AuthForm from '@/components/auth-form'
import { createClient, SupabaseClient } from '@supabase/supabase-js'

function useAuth() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
  const supabase = createClient(supabaseUrl, supabaseAnonKey)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }: { data: { session: any } }) => {
      setUser(data.session?.user ?? null)
      setLoading(false)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event: string, session: any) => {
      setUser(session?.user ?? null)
    })
    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  const signUp = async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signUp({ email, password })
    setLoading(false)
    if (error) setError(error.message)
  }

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) setError(error.message)
  }

  const signOut = async () => {
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signOut()
    setLoading(false)
    if (error) setError(error.message)
  }

  return { user, loading, error, signUp, signIn, signOut }
}

export default function AuthChatGate() {
  const { user, loading, error, signIn, signUp } = useAuth()
  const [success, setSuccess] = useState('')
  if (loading) return <div className="text-center mt-10">로딩 중...</div>
  if (!user) return <AuthForm signIn={signIn} signUp={signUp} loading={loading} error={error} success={success} setSuccess={setSuccess} />
  return <EnhancedChat />
} 