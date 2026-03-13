interface RedFlagsListProps {
  redFlags: string[]
}

export default function RedFlagsList({ redFlags }: RedFlagsListProps) {
  return (
    <div className="space-y-4">
      <h2 className="font-mono text-lg font-medium text-[var(--color-text)]">
        Red flags detected
      </h2>
      <ul className="space-y-6" role="list">
        {redFlags.map((flag, i) => (
          <li key={i} className="group flex min-h-[96px] items-start">
            {/* Pole - tall, extends above and below the flag */}
            <div
              className="relative z-10 flex h-24 w-3 shrink-0 flex-col items-center rounded-l-md bg-gradient-to-b from-stone-600 via-stone-700 to-stone-800"
              aria-hidden
            >
              <div className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-amber-400 shadow-sm" />
              <span className="mt-10 font-mono text-xs font-bold text-stone-400">
                {i + 1}
              </span>
            </div>
            {/* Flag - 60% width */}
            <div
              className="relative -ml-px flex min-h-[52px] w-[60%] shrink-0 items-center px-5 py-3 transition-all group-hover:scale-[1.01]"
              style={{
                background: `
                  linear-gradient(135deg, rgba(239, 68, 68, 0.9) 0%, rgba(185, 28, 28, 0.95) 50%, rgba(127, 29, 29, 0.9) 100%),
                  repeating-linear-gradient(
                    45deg,
                    transparent,
                    transparent 6px,
                    rgba(0,0,0,0.08) 6px,
                    rgba(0,0,0,0.08) 8px
                  )
                `,
                border: '1px solid rgba(239, 68, 68, 0.5)',
                borderLeft: 'none',
                boxShadow: '3px 2px 12px rgba(0,0,0,0.4)',
              }}
            >
              <span className="relative z-10 text-[var(--color-text)] font-medium drop-shadow-md">
                {flag}
              </span>
              {/* Fabric fold shadow */}
              <div
                className="pointer-events-none absolute right-0 top-0 h-full w-12"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.15) 100%)',
                  clipPath: 'polygon(30% 0, 100% 0, 100% 100%, 0 100%)',
                }}
                aria-hidden
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
