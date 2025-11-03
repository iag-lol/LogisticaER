import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CircleAlert, Send, ThumbsUp } from 'lucide-react'

const requests = [
  {
    id: 'req-1',
    title: 'Solicitud de recursos · Turno noche',
    detail: '2 radios portátiles y kits de seguridad',
    requester: 'IPA González',
    status: 'En aprobación',
  },
  {
    id: 'req-2',
    title: 'Relevo extraordinario IP',
    detail: 'Cobertura puerto Valpo sector B',
    requester: 'S Muñoz',
    status: 'Aprobado',
  },
]

export default function RequestsPage() {
  return (
    <div className="flex w-full flex-col gap-6 pb-12">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Solicitudes y requerimientos</h2>
          <p className="text-sm text-slate-400">
            Control de peticiones IP/IPA y respuesta del mando superior.
          </p>
        </div>
        <Button className="rounded-2xl">
          <Send className="mr-2 h-4 w-4" />
          Nueva solicitud
        </Button>
      </header>

      <section className="flex flex-col gap-3">
        {requests.map((request) => (
          <Card key={request.id} className="border border-slate-900/70 bg-slate-900/60">
            <CardHeader className="flex flex-row items-start justify-between gap-4">
              <div>
                <CardTitle className="text-lg text-white">{request.title}</CardTitle>
                <p className="text-xs text-slate-500">Solicitado por: {request.requester}</p>
              </div>
              <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand">
                {request.status}
              </span>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
              {request.status === 'Aprobado' ? (
                <ThumbsUp className="h-4 w-4 text-emerald-400" />
              ) : (
                <CircleAlert className="h-4 w-4 text-yellow-400" />
              )}
              {request.detail}
              <Button variant="ghost" size="sm" className="ml-auto rounded-2xl">
                Ver seguimiento
              </Button>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  )
}
