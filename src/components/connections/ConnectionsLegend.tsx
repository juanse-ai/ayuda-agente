/** Leyenda del grafo: qué significa cada color y qué son los hilos. */
export function ConnectionsLegend() {
    return (
        <div className="border-line bg-surface/85 absolute top-4 left-4 z-10 flex flex-col gap-2 rounded-xl border px-4 py-3 backdrop-blur">
            <div className="flex items-center gap-2.5">
                <span className="bg-need size-2.5 shrink-0 rounded-full" aria-hidden />
                <span className="text-fg-muted text-xs">Necesita ayuda</span>
            </div>
            <div className="flex items-center gap-2.5">
                <span className="bg-offer size-2.5 shrink-0 rounded-full" aria-hidden />
                <span className="text-fg-muted text-xs">Ofrece ayuda</span>
            </div>
            <div className="flex items-center gap-2.5">
                <span
                    className="bg-fg h-0.5 w-4 shrink-0 rounded-full shadow-[0_0_6px_var(--color-fg)]"
                    aria-hidden
                />
                <span className="text-fg-muted text-xs">Conexión — más brillo, mejor coincidencia</span>
            </div>
        </div>
    )
}
