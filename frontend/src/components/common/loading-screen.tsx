export function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-200">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand/20 border-t-brand" />
        <span className="text-sm font-medium tracking-wide text-slate-400">
          Cargando aplicación...
        </span>
      </div>
    </div>
  )
}
