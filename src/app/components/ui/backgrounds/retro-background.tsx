/**
 * Abbey Road–inspired backdrop: daylight sky/leaf washes, zebra band, four walkers.
 * Stylistic homage — not a reproduction of the album cover.
 */
export function RetroBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 bg-surface-950" aria-hidden>
      <div className="absolute inset-0 abbey-sky" />
      <div className="absolute inset-0 abbey-canopy" />
      <div className="absolute inset-x-0 bottom-0 h-[38%] abbey-asphalt" />
      <div className="absolute inset-x-0 bottom-[14%] h-[7.5rem] sm:h-[9rem] abbey-zebra opacity-[0.22]" />
      <svg
        className="absolute bottom-[16%] left-1/2 w-[min(480px,86vw)] -translate-x-1/2 text-surface-950"
        viewBox="0 0 400 110"
        fill="currentColor"
        role="presentation"
      >
        <ellipse cx="200" cy="102" rx="170" ry="8" className="opacity-30" />

        {/* Four walkers L→R — denim / black / black / white read via opacity */}
        <g opacity="0.72" transform="translate(40 8)">
          <circle cx="22" cy="10" r="7" />
          <path d="M14 20h16l2 28H12l2-28z" />
          <path d="M12 48l-8 42h8l6-28 4 28h8l-6-42z" />
          <path d="M14 28l-12 18h7l9-14zM30 28l12 16h-7l-9-12z" />
        </g>
        <g opacity="0.82" transform="translate(120 6)">
          <circle cx="22" cy="10" r="7" />
          <path d="M13 20h18l2 30H11l2-30z" />
          <path d="M11 50l-6 42h8l5-30 5 30h8l-7-42z" />
          <path d="M13 30l-11 16h7l8-12zM31 30l11 14h-7l-8-10z" />
        </g>
        <g opacity="0.88" transform="translate(200 4)">
          <circle cx="22" cy="10" r="7" />
          <path d="M13 20h18l2 30H11l2-30z" />
          <path d="M11 50l-7 42h8l6-30 4 30h8l-6-42z" />
          <path d="M13 30l-10 15h7l7-11zM31 30l12 15h-7l-9-11z" />
        </g>
        <g opacity="0.58" transform="translate(280 2)">
          <circle cx="22" cy="10" r="7" />
          <path d="M12 20h20l2 32H10l2-32z" />
          <path d="M10 52l-8 42h9l6-30 5 30h9l-8-42z" />
          <path d="M12 32l-12 17h7l9-13zM32 32l13 16h-7l-10-12z" />
        </g>
      </svg>
      <div className="absolute inset-0 abbey-daylight" />
    </div>
  )
}
