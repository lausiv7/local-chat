import { useState } from 'react'

interface AuthFormProps {
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  loading: boolean
  error: string | null
  success: string
  setSuccess: (msg: string) => void
}

export default function AuthForm({ signIn, signUp, loading, error, success, setSuccess }: AuthFormProps) {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccess('')
    if (isSignUp) {
      await signUp(email, password)
      setSuccess('회원가입 완료! 이메일을 확인하세요.')
    } else {
      await signIn(email, password)
      setSuccess('로그인 성공!')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto p-4 border rounded space-y-4">
      <h2 className="text-xl font-bold text-center">{isSignUp ? '회원가입' : '로그인'}</h2>
      <input
        type="email"
        placeholder="이메일"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
        disabled={loading}
      >
        {loading ? '처리 중...' : isSignUp ? '회원가입' : '로그인'}
      </button>
      {error && <div className="text-red-500 text-sm text-center">{error}</div>}
      {success && <div className="text-green-600 text-sm text-center">{success}</div>}
      <div className="text-center">
        <button
          type="button"
          className="text-blue-500 underline text-sm"
          onClick={() => setIsSignUp(v => !v)}
        >
          {isSignUp ? '이미 계정이 있으신가요? 로그인' : '계정이 없으신가요? 회원가입'}
        </button>
      </div>
    </form>
  )
} 