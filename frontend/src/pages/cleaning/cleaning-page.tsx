import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Droplet, SprayCan, Wrench } from 'lucide-react'

const cleaningPlans = [
  {
    id: 'clean-1',
    title: 'Plan de sanitización flota A1',
    description: 'Limpieza profunda semanal · Terminal Norte',
    status: 'En ejecución',
    team: ['IPA Torres', 'IP Rivas'],
  },
  {
    id: 'clean-2',
    title: 'Revisión carrocería camiones cisterna',
    description: 'Checklist estructural + documentación',
    status: 'Pendiente',
    team: ['IP Soto'],
  },
]

export default function CleaningPage() {
  return (
    <div className="flex w-full flex-col gap-6 pb-12">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Aseo y Carrocería</h2>
          <p className="text-sm text-slate-400">
            Coordinación de cuadrillas, recursos y estándares de limpieza.
          </p>
        </div>
        <Button className="rounded-2xl">
          <SprayCan className="mr-2 h-4 w-4" />
          Nueva pauta
        </Button>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        {cleaningPlans.map((plan) => (
          <Card key={plan.id} className="border border-slate-900/70 bg-slate-900/60">
            <CardHeader className="flex flex-row items-start justify-between gap-4">
              <div>
                <CardTitle className="text-lg text-white">{plan.title}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </div>
              <Droplet className="h-6 w-6 text-cyan-400" />
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Estado:</span>
                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-400">
                  {plan.status}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Wrench className="h-4 w-4" />
                Equipo: {plan.team.join(', ')}
              </div>
              <Button variant="ghost" size="sm" className="self-end rounded-2xl">
                Ver checklist
              </Button>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  )
}
