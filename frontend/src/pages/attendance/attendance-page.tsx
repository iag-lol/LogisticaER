import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CalendarDays, UserCheck, UserMinus } from 'lucide-react'

const attendanceOverview = [
  {
    id: 'att-1',
    title: 'Turno Mañana · Terminal Norte',
    present: 12,
    absent: 1,
    supervisor: 'S Muñoz',
  },
  {
    id: 'att-2',
    title: 'Turno Noche · Terminal Sur',
    present: 9,
    absent: 0,
    supervisor: 'S Araya',
  },
]

export default function AttendancePage() {
  return (
    <div className="flex w-full flex-col gap-6 pb-12">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Asistencia</h2>
          <p className="text-sm text-slate-400">
            Seguimiento de dotación por turno y control de ausencias.
          </p>
        </div>
        <Button className="rounded-2xl">
          <CalendarDays className="mr-2 h-4 w-4" />
          Registrar asistencia
        </Button>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        {attendanceOverview.map((attendance) => (
          <Card key={attendance.id} className="border border-slate-900/70 bg-slate-900/60">
            <CardHeader>
              <CardTitle className="text-lg text-white">{attendance.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-emerald-400" />
                Presentes: {attendance.present}
              </div>
              <div className="flex items-center gap-2">
                <UserMinus className="h-4 w-4 text-red-400" />
                Ausentes: {attendance.absent}
              </div>
              <div className="text-xs text-slate-500">
                Supervisor líder: {attendance.supervisor}
              </div>
              <Button variant="ghost" size="sm" className="self-end rounded-2xl">
                Ver detalle
              </Button>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  )
}
