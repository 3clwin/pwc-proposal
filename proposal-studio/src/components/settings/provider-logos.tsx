'use client'

import type { LLMProvider } from '@/types'

interface LogoProps {
  className?: string
}

function AnthropicLogo({ className = 'size-6' }: LogoProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 46 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M32.73 0H26.37L38.42 32h6.36L32.73 0Zm-19.46 0L1.22 32h6.36l2.63-6.9h13.58l2.63 6.9h6.36L20.73 0h-7.46Zm-1.02 19.45 4.75-12.48 4.75 12.48h-9.5Z"
        fill="currentColor"
      />
    </svg>
  )
}

function OpenAILogo({ className = 'size-6' }: LogoProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M22.28 9.37a6.2 6.2 0 0 0-.54-5.11A6.27 6.27 0 0 0 15 1.16a6.2 6.2 0 0 0-4.7-2.16 6.27 6.27 0 0 0-5.97 4.34A6.2 6.2 0 0 0 .2 6.5a6.27 6.27 0 0 0 .77 7.36 6.2 6.2 0 0 0 .54 5.11 6.27 6.27 0 0 0 6.74 3.1 6.2 6.2 0 0 0 4.7 2.16 6.27 6.27 0 0 0 5.97-4.34 6.2 6.2 0 0 0 4.13-3.16 6.27 6.27 0 0 0-.77-7.36ZM13 22.95a4.68 4.68 0 0 1-3-.98l.15-.08 4.99-2.88a.81.81 0 0 0 .41-.71v-7.04l2.11 1.22a.07.07 0 0 1 .04.06v5.83a4.72 4.72 0 0 1-4.7 4.58ZM3.52 18.75a4.67 4.67 0 0 1-.56-3.14l.15.09 4.99 2.88a.82.82 0 0 0 .82 0l6.1-3.52v2.44a.08.08 0 0 1-.03.06l-5.05 2.92a4.72 4.72 0 0 1-6.42-1.73ZM2.27 7.88a4.67 4.67 0 0 1 2.44-2.06v5.94a.81.81 0 0 0 .41.7l6.1 3.52-2.12 1.22a.08.08 0 0 1-.07 0l-5.05-2.92A4.72 4.72 0 0 1 2.27 7.88Zm16.25 3.78-6.1-3.53 2.12-1.22a.08.08 0 0 1 .07 0l5.05 2.92a4.72 4.72 0 0 1-.73 8.52v-5.98a.82.82 0 0 0-.41-.71ZM20.63 8.4l-.15-.09-4.99-2.88a.82.82 0 0 0-.82 0l-6.1 3.52V6.5a.08.08 0 0 1 .03-.06l5.05-2.92A4.72 4.72 0 0 1 20.63 8.4ZM7.35 13.75l-2.11-1.22a.07.07 0 0 1-.04-.06V6.64A4.72 4.72 0 0 1 13 3.05l-.15.08-4.99 2.88a.81.81 0 0 0-.41.71l-.1 7.03Zm1.15-2.47L12 9.18l3.5 2.1v4.2L12 17.58l-3.5-2.1v-4.2Z"
        fill="currentColor"
      />
    </svg>
  )
}

function GeminiLogo({ className = 'size-6' }: LogoProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M12 24A14.3 14.3 0 0 0 12 0a14.29 14.29 0 0 0 0 24Z"
        fill="url(#gemini-grad)"
      />
      <defs>
        <radialGradient
          id="gemini-grad"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(3.08 2.46) scale(21.37)"
        >
          <stop offset="0" stopColor="#4285F4" />
          <stop offset=".3" stopColor="#5B9BF4" />
          <stop offset=".55" stopColor="#9B72CB" />
          <stop offset=".75" stopColor="#D96570" />
          <stop offset="1" stopColor="#F49C46" />
        </radialGradient>
      </defs>
    </svg>
  )
}

const PROVIDER_LOGOS: Record<LLMProvider, React.FC<LogoProps>> = {
  anthropic: AnthropicLogo,
  openai: OpenAILogo,
  google: GeminiLogo,
}

export { PROVIDER_LOGOS, AnthropicLogo, OpenAILogo, GeminiLogo }
