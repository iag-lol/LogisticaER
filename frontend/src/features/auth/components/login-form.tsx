import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, ShieldHalf } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuthActions } from '../hooks/use-auth-actions'
import { useLocation, useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'

const loginSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, 'Ingresa tu usuario')
    .min(3, 'Debe tener al menos 3 caracteres'),
  password: z
    .string()
    .min(1, 'Ingresa tu contraseña')
    .min(6, 'La contraseña es demasiado corta'),
})

type LoginValues = z.infer<typeof loginSchema>

export function LoginForm() {
  const navigate = useNavigate()
  const location = useLocation()
  const { signIn } = useAuthActions()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  const redirectPath = useMemo(() => {
    const state = location.state as { from?: Location } | null
    return state?.from?.pathname ?? '/'
  }, [location.state])

  const onSubmit = async (values: LoginValues) => {
    setIsSubmitting(true)
    try {
      await signIn(values)
      navigate(redirectPath, { replace: true })
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Verifica tus credenciales y vuelve a intentar.'
      setError('username', { message })
      setError('password', { message })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full max-w-md flex-col gap-6 rounded-3xl border border-slate-900/60 bg-slate-950/70 p-8 shadow-[0_25px_80px_-25px_rgba(15,23,42,0.8)] backdrop-blur"
    >
      <div className="flex flex-col gap-2 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/10 text-brand">
          <ShieldHalf className="h-7 w-7" />
        </div>
        <h1 className="text-2xl font-semibold text-white">
          Panel de control · Equipo CLM
        </h1>
        <p className="text-sm text-slate-400">
          Accede con tu usuario corporativo asignado por Jefe de Patio o Supervisor Administrador.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="username" requiredIndicator>
          Usuario
        </Label>
        <Input
          id="username"
          placeholder="nombre@equipo.clm"
          autoComplete="username"
          {...register('username')}
        />
        {errors.username?.message && (
          <p className="text-sm font-medium text-red-400">
            {errors.username.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="password" requiredIndicator>
          Contraseña
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            autoComplete="current-password"
            {...register('password')}
            className="pr-12"
          />
          <button
            type="button"
            className={cn(
              'absolute inset-y-0 right-3 my-auto flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-900/70 hover:text-slate-100',
            )}
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {errors.password?.message && (
          <p className="text-sm font-medium text-red-400">
            {errors.password.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        size="lg"
        className="rounded-2xl text-base"
        disabled={isSubmitting}
        fullWidth
      >
        {isSubmitting ? 'Ingresando...' : 'Ingresar'}
      </Button>

      <p className="text-center text-xs text-slate-500">
        ¿Problemas? Contacta con tu Supervisor Administrador para reestablecer credenciales.
      </p>
    </form>
  )
}
