import * as React from "react"

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  size?: number
}

export function Logo({ size = 24, className, ...props }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <rect x="3.5" y="6.5" width="25" height="19" rx="3.5" stroke="currentColor" strokeWidth="2" />
      <circle cx="11" cy="16" r="2" fill="currentColor" />
      <path d="M16 12.5C18.25 14.35 18.25 17.65 16 19.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M20 10C24.15 13.25 24.15 18.75 20 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
