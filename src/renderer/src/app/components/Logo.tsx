import { Image } from '@heroui/react'
import { LOGO } from '@renderer/constants/images'
import { Link } from 'react-router'

export const Logo = () => {
  return (
    <div className="flex min-w-6 items-center gap-4 pl-3">
      <Image
        src={LOGO}
        width={50}
        height={50}
        alt="Logo"
        className="h-5 w-6"
        draggable={false}
      />
      <span className="hidden text-2xl font-medium text-text-primary group-hover/sidebar:inline-block">
        Wartlock
      </span>
    </div>
  )
}

export const LogoIcon = () => {
  return (
    <Link
      to="/"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-text-primary"
    >
      <div className="h-5 w-6 shrink-0 rounded-bl-sm rounded-br-lg rounded-tl-lg rounded-tr-sm bg-primary dark:bg-accent" />
    </Link>
  )
}
