import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  CheckCircle2,
  Clock,
  Flame,
  Plus,
  Radio,
} from 'lucide-react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

const activityData = [
  { day: 'Lun', completadas: 6, pendientes: 3 },
  { day: 'Mar', completadas: 8, pendientes: 2 },
  { day: 'Mié', completadas: 5, pendientes: 4 },
  { day: 'Jue', completadas: 9, pendientes: 1 },
  { day: 'Vie', completadas: 7, pendientes: 2 },
  { day: 'Sáb', completadas: 4, pendientes: 1 },
  { day: 'Dom', completadas: 3, pendientes: 0 },
]

const realtimeEvents = [
  {
    id: '1',
    title: 'Tarea prioritaria completada: Patio Norte',
    timestamp: new Date(),
    type: 'success',
  },
  {
    id: '2',
    title: 'Reunión de coordinación programada',
    timestamp: new Date(Date.now() - 1000 * 60 * 10),
    type: 'info',
  },
  {
    id: '3',
    title: 'Nueva solicitud de recursos (IPA Francisco)',
    timestamp: new Date(Date.now() - 1000 * 60 * 35),
    type: 'warning',
  },
]

function formatRelativeTime(date: Date) {
  const diff = Date.now() - date.getTime()
  const minutes = Math.round(diff / (1000 * 60))
  if (minutes < 1) return 'ahora'
  if (minutes < 60) return `hace ${minutes} min`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `hace ${hours} h`
  const days = Math.round(hours / 24)
  return `hace ${days} d`
}

export default function DashboardPage() {
  return (
    <div className="flex w-full flex-col gap-6 pb-12">
      <section className="grid gap-4 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-brand/20 via-slate-900 to-slate-950">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardDescription className="text-brand">Tareas activas</CardDescription>
              <CardTitle className="text-3xl">18</CardTitle>
            </div>
            <Flame className="h-8 w-8 text-brand" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-brand/80">
              5 prioridades críticas requieren tu atención hoy.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardDescription>Completadas esta semana</CardDescription>
              <CardTitle className="text-3xl">42</CardTitle>
            </div>
            <CheckCircle2 className="h-8 w-8 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-400">
              +18% vs semana anterior.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardDescription>Actas pendientes de firma</CardDescription>
              <CardTitle className="text-3xl">6</CardTitle>
            </div>
            <Clock className="h-8 w-8 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <Button variant="ghost" className="rounded-2xl px-3 text-sm text-slate-300">
              Ver detalle
            </Button>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-[2fr,1fr]">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Pulso operativo semanal</CardTitle>
              <CardDescription>
                Seguimiento de cumplimiento y backlog por día.
              </CardDescription>
            </div>
            <Button variant="muted" size="sm" className="rounded-2xl">
              Descargar informe
            </Button>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activityData}>
                  <defs>
                    <linearGradient id="colorCompletadas" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorPendientes" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e2a47" />
                  <XAxis dataKey="day" stroke="#475569" />
                  <YAxis stroke="#475569" />
                  <Tooltip
                    contentStyle={{
                      background: '#0f172a',
                      borderRadius: '1rem',
                      border: '1px solid rgba(148, 163, 184, 0.1)',
                      color: '#e2e8f0',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="completadas"
                    stroke="#22c55e"
                    fillOpacity={1}
                    fill="url(#colorCompletadas)"
                  />
                  <Area
                    type="monotone"
                    dataKey="pendientes"
                    stroke="#f97316"
                    fillOpacity={1}
                    fill="url(#colorPendientes)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Tiempo real</CardTitle>
              <CardDescription>Actualizado {format(new Date(), 'HH:mm', { locale: es })}</CardDescription>
            </div>
            <Radio className="h-5 w-5 text-emerald-400" />
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {realtimeEvents.map((event) => (
              <div
                key={event.id}
                className="rounded-2xl border border-slate-900 bg-slate-900/50 p-3"
              >
                <p className="text-sm font-medium text-slate-100">
                  {event.title}
                </p>
                <span className="text-xs uppercase tracking-widest text-slate-500">
                  {formatRelativeTime(event.timestamp)}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">
            Acciones rápidas
          </h2>
          <Button size="sm" variant="default" className="rounded-2xl">
            <Plus className="mr-2 h-4 w-4" />
            Nueva tarea
          </Button>
        </div>
      </section>
    </div>
  )
}
