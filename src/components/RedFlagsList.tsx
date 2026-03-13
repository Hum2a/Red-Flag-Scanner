interface RedFlagsListProps {
  redFlags: string[]
}

export default function RedFlagsList({ redFlags }: RedFlagsListProps) {
  return (
    <div className="space-y-4">
      <h2 className="font-mono text-lg font-medium text-[var(--color-text)]">
        Red flags detected
      </h2>
      <ul className="space-y-3" role="list">
        {redFlags.map((flag, i) => (
          <li
            key={i}
            className="group flex items-start gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 transition-all hover:border-[var(--color-accent)]/30 hover:bg-[var(--color-surface-elevated)]"
          >
            <span
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--color-accent)]/20 font-mono text-sm font-medium text-[var(--color-accent)]"
              aria-hidden
            >
              {i + 1}
            </span>
            <span className="text-[var(--color-text)]">{flag}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
