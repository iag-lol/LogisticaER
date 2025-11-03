import { LoginForm } from '@/features/auth/components/login-form'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900 px-6 py-10">
      <div className="absolute inset-0 overflow-hidden">
        <div className="pointer-events-none absolute -left-24 top-10 h-52 w-52 rounded-full bg-brand/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-indigo-600/20 blur-3xl" />
      </div>
      <div className="relative z-10 flex w-full justify-center">
        <LoginForm />
      </div>
    </div>
  )
}
