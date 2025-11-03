import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CalendarClock, Link2, Users } from 'lucide-react'

const meetings = [
  {
    id: 'meet-1',
    title: 'Coordinación turnos semana 45',
    date: 'Jueves 10:00',
    owner: 'JT Andrade',
    attendees: ['SA Vásquez', 'S Muñoz', 'IPA González'],
    link: 'https://meet.clm/team',
  },
  {
    id: 'meet-2',
    title: 'Seguimiento Aseo y Carrocería',
    date: 'Viernes 08:30',
    owner: 'SA Vásquez',
    attendees: ['S Muñoz', 'IPA Torres', 'IP Rivas'],
    link: 'https://meet.clm/aseo',
  },
]

export default function MeetingsPage() {
  return (
    <div className="flex w-full flex-col gap-6 pb-12">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Reuniones y briefings</h2>
          <p className="text-sm text-slate-400">
            Define encuentros formales con seguimiento de acuerdos.
          </p>
        </div>
        <Button className="rounded-2xl">Programar reunión</Button>
      </header>

      <section className="flex flex-col gap-3">
        {meetings.map((meeting) => (
          <Card key={meeting.id} className="border border-slate-900/70 bg-slate-900/60">
            <CardHeader className="flex flex-row items-start justify-between gap-4">
              <div>
                <CardTitle className="text-lg text-white">{meeting.title}</CardTitle>
                <CardDescription>
                  Responsable: {meeting.owner}
                </CardDescription>
              </div>
              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-400">
                Confirmada
              </span>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1">
                <CalendarClock className="h-3 w-3 text-sky-400" />
                {meeting.date}
              </span>
              <span className="flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1">
                <Users className="h-3 w-3 text-indigo-400" />
                {meeting.attendees.join(', ')}
              </span>
              <a
                href={meeting.link}
                target="_blank"
                className="ml-auto inline-flex items-center gap-2 rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand"
              >
                <Link2 className="h-3 w-3" />
                Enlace
              </a>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  )
}
