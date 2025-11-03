import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DownloadCloud, FileSpreadsheet, PieChart } from 'lucide-react'

const reports = [
  {
    id: 'rep-1',
    title: 'Informe semanal de operaciones',
    description: 'Detalle de tareas por rol, avances y backlog.',
    lastUpdated: 'Actualizado hoy 07:30',
  },
  {
    id: 'rep-2',
    title: 'KPIs Aseo y Carrocería',
    description: 'Rendimiento de cuadrillas, tiempos muertos y hallazgos.',
    lastUpdated: 'Actualizado ayer 19:15',
  },
]

export default function ReportsPage() {
  return (
    <div className="flex w-full flex-col gap-6 pb-12">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Informes ejecutivos</h2>
          <p className="text-sm text-slate-400">
            Exporta reportes preparados para auditoría y seguimiento.
          </p>
        </div>
        <Button variant="muted" className="rounded-2xl">
          Programar envío automático
        </Button>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        {reports.map((report) => (
          <Card key={report.id} className="border border-slate-900/70 bg-slate-900/60">
            <CardHeader className="flex flex-row items-start justify-between gap-4">
              <div>
                <CardTitle className="text-lg text-white">{report.title}</CardTitle>
                <CardDescription>{report.description}</CardDescription>
              </div>
              <PieChart className="h-6 w-6 text-sky-400" />
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <span className="text-xs text-slate-500">{report.lastUpdated}</span>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="rounded-2xl">
                  <DownloadCloud className="mr-2 h-4 w-4" />
                  PDF
                </Button>
                <Button variant="ghost" size="sm" className="rounded-2xl">
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Excel
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  )
}
