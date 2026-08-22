export function ThemeBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      <div className="absolute inset-0 bg-surface-950">
        <div className="absolute inset-0 ambient-glow" />
      </div>
    </div>
  )
}
