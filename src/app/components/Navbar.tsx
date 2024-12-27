import Link from 'next/link'
import { AuthModal } from './AuthModal'
import { TitleWithLogo } from './TitleWithLogo'

export default function Navbar() {
  return (
    <div className="flex py-5 items-center justify-between">
      <Link href="/" className="flex items-center gap-2">
        <TitleWithLogo />
      </Link>

      <AuthModal />
    </div>
  )
}
