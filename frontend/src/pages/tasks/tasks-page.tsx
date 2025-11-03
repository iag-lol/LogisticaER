import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { BadgeCheck, CircleDot, Filter, Plus } from 'lucide-react'

const mockTasks = [
  {
    id: 'task-1',
    title: 'Inspección preventiva · Terminal Norte',
    priority: 'Crítica',
    status: 'En proceso',
    dueDate: 'Hoy 18:00',
    assignees: ['IPA González', 'IP Rivas'],
    supervisors: ['S Muñoz'],
  },
  {
    id: 'task-2',
    title: 'Coordinación limpieza flota #23',
    priority: 'Alta',
    status: 'Pendiente',
    dueDate: 'Mañana 09:00',
    assignees: ['IP Soto'],
    supervisors: ['SA Vásquez'],
  },
]

export default function TasksPage() {
  return (
    <div className="flex w-full flex-col gap-6 pb-12">
      <header className="flex flex-col gap-4">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Tareas operativas</h2>
            <p className="text-sm text-slate-400">
              Asigna y controla el avance por supervisor y rol.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="muted" size="sm" className="rounded-2xl">
              <Filter className="mr-2 h-4 w-4" />
              Filtros
            </Button>
            <Button size="sm" className="rounded-2xl">
              <Plus className="mr-2 h-4 w-4" />
              Nueva tarea
            </Button>
          </div>
        </div>
      </header>

      <section className="flex flex-col gap-3">
        {mockTasks.map((task) => (
          <Card key={task.id} className="border border-slate-900/70 bg-slate-900/60">
            <CardHeader className="flex flex-row items-start justify-between gap-4">
              <div className="space-y-1">
                <CardTitle className="text-lg text-white">{task.title}</CardTitle>
                <CardDescription>
                  Líder: {task.supervisors.join(', ')} · Inspectores:{' '}
                  {task.assignees.join(', ')}
                </CardDescription>
              </div>
              <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand">
                {task.priority}
              </span>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-400">
              <span className="flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1">
                <CircleDot className="h-3 w-3 text-yellow-400" />
                {task.status}
              </span>
              <span className="flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1">
                <BadgeCheck className="h-3 w-3 text-emerald-400" />
                {task.dueDate}
              </span>
              <Button variant="ghost" size="sm" className="ml-auto rounded-2xl text-xs">
                Ver detalle
              </Button>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  )
}
