/**
 * Blurryface-era graphic homage: red-on-black barcode marks, |-/ watermark,
 * slash overlays, and a subdued disco sweep — CSS/SVG only, no cover art.
 */
export function DiscoBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden bg-surface-950" aria-hidden>
      <div className="absolute inset-0 blurryface-ink" />
      <div className="absolute inset-0 blurryface-barcode" />
      <div className="absolute inset-0 blurryface-slashes" />
      <div className="absolute inset-0 disco-sweep opacity-50" />
      <div className="absolute inset-0 disco-speckles" />

      <svg
        className="blurryface-mark blurryface-mark-logo"
        viewBox="0 0 120 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M18 12v56M42 40h28M78 16l24 48"
          stroke="currentColor"
          strokeWidth="10"
          strokeLinecap="square"
          strokeLinejoin="miter"
        />
      </svg>

      <svg
        className="blurryface-mark blurryface-mark-hand"
        viewBox="0 0 160 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M78 188c-18-6-28-28-26-52 2-18 10-34 14-52 2-10-2-18-10-22-6-3-8-10-4-16 3-5 10-6 15-3 4 2 8 2 12-1 5-4 12-3 15 2 2 4 7 6 12 5 6-1 11 4 11 10 0 4-1 8 2 11 8 8 10 22 6 34-6 20-14 38-12 56 2 22-8 40-25 48-4 2-8 2-10 0z"
          fill="currentColor"
          opacity="0.9"
        />
        <path
          d="M62 78c2-14 6-26 4-34M86 70c1-16 2-30-2-40M106 78c4-14 8-26 6-36M122 92c8-12 14-22 12-32"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.55"
        />
        <path
          d="M70 130h28M68 148h32M72 166h24"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="square"
          opacity="0.4"
        />
      </svg>

      <div className="absolute inset-0 blurryface-pulse" />
    </div>
  )
}
