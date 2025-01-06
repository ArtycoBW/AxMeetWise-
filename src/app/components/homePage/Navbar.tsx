import Link from 'next/link'
import { AuthModal } from './AuthModal'
import { TitleWithLogo } from '../TitleWithLogo'
import { ThemeToggle } from '../theme/ThemeToggle'

export default function Navbar() {
  return (
    <div className="flex py-5 items-center justify-between">
      <Link href="/" className="flex items-center gap-2">
        <TitleWithLogo />
      </Link>

      <nav className="hidden md:flex md:justify-end md:space-x-4">
        <ThemeToggle />

        <AuthModal />
      </nav>
    </div>
  )
}
