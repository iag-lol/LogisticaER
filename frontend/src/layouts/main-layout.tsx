import { NavLink, Outlet } from 'react-router-dom'
import {
  LayoutDashboard,
  ClipboardList,
  CalendarCheck,
  FileText,
  Sparkles,
  Users,
  Send,
  LogOut,
  Bell,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/features/auth/hooks/use-auth'
import { useAuthActions } from '@/features/auth/hooks/use-auth-actions'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { useMemo } from 'react'

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { label: 'Tareas', path: '/tasks', icon: ClipboardList },
  { label: 'Reuniones', path: '/meetings', icon: CalendarCheck },
  { label: 'Informes', path: '/reports', icon: FileText },
  { label: 'Aseo', path: '/cleaning', icon: Sparkles },
  { label: 'Asistencia', path: '/attendance', icon: Users },
  { label: 'Solicitudes', path: '/requests', icon: Send },
] as const

export function MainLayout() {
  const { profile } = useAuth()
  const { signOut } = useAuthActions()

  const today = useMemo(
    () =>
      format(new Date(), "EEEE d 'de' MMMM", {
        locale: es,
      }),
    [],
  )

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-50 border-b border-slate-900/60 bg-slate-950/90 backdrop-blur-lg">
        <div className="mx-auto flex w-full max-w-4xl items-center justify-between px-4 py-4">
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-[0.3em] text-slate-500">
              Equipo CLM
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              {profile?.name ?? 'Bienvenido'}
            </h1>
            <span className="text-xs font-medium text-slate-500">
              {profile?.role ?? 'Rol pendiente'} · {today}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="rounded-2xl">
              <Bell className="h-5 w-5" />
            </Button>
            <Button
              variant="muted"
              size="sm"
              className="rounded-2xl px-3 py-2"
              onClick={() => signOut().catch(console.error)}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar sesión
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-4xl flex-1 px-4 pb-28 pt-6">
        <Outlet />
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-900/60 bg-slate-950/95 backdrop-blur-lg">
        <div className="mx-auto flex w-full max-w-4xl items-center justify-between px-2 py-3">
          {NAV_ITEMS.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                cn(
                  'flex flex-1 flex-col items-center gap-1 rounded-2xl px-2 py-2 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand',
                  isActive
                    ? 'bg-brand/10 text-brand'
                    : 'text-slate-500 hover:bg-slate-900/60 hover:text-slate-200',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={cn('h-5 w-5', isActive ? 'text-brand' : '')} />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
