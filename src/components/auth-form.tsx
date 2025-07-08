import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function AuthForm() {
  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google' })
  }
  return (
    <div className="max-w-sm mx-auto p-8 border rounded space-y-6 bg-white">
      <h2 className="text-2xl font-bold text-center">Welcome</h2>
      <p className="text-center text-gray-500 mb-4">Sign in to create a persistent local identity.</p>
      <button
        onClick={handleGoogleLogin}
        className="w-full bg-blue-400 text-white py-3 rounded text-lg font-medium hover:bg-blue-500 transition"
      >
        Sign In with Google
      </button>
    </div>
  )
} 