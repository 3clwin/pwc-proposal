interface PwcLogoProps {
  className?: string
}

/**
 * PwC brand mark — three colored geometric marks above a lowercase "pwc"
 * wordmark. Colors and proportions mirror the public PwC corporate logo.
 *
 * Usage: lockup auth screens, marketing surfaces, and any spot where the
 * proposal app needs to read as a PwC product.
 */
export function PwcLogo({ className = 'h-12 w-auto' }: PwcLogoProps) {
  return (
    <svg
      viewBox="0 0 120 60"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      aria-label="PwC"
      className={className}
    >
      {/* Three accent marks — orange, yellow, red — staggered above the
          wordmark on the 4px grid (8px gap, 12px tall each). */}
      <rect x="8" y="4" width="24" height="14" fill="#DC6900" />
      <rect x="40" y="4" width="32" height="14" fill="#FFB600" />
      <rect x="80" y="4" width="32" height="14" fill="#E0301E" />

      {/* Wordmark — Helvetica-equivalent geometric sans, slightly tracked
          out, dark charcoal so it reads as official brand and not generic
          dark gray. */}
      <text
        x="8"
        y="50"
        fontFamily="Helvetica, Arial, sans-serif"
        fontSize="28"
        fontWeight="700"
        letterSpacing="-0.5"
        fill="#2D2D2D"
      >
        pwc
      </text>
    </svg>
  )
}
