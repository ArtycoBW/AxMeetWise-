import { ReactNode } from 'react'
import Image from 'next/image'
import Logo from '@/../public/logo.png'
import Link from 'next/link'
import { DashboardLinks } from '../components/DashboardLinks'

interface IDashboardLayoutProps {
  children?: ReactNode
}

function DashboardLayout({ children }: IDashboardLayoutProps) {
  return (
    <>
      <div className="min-h-screen w-full grid md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <div className="hidden md:block border-r bg-muted/40">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
              <Link href="/" className="flex items-center gap-2">
                <Image src={Logo} alt="Logo" className="size-8" />
                <p className="text-xl font-semibold">
                  <span className="text-primary">Ax</span>MeetWise
                </p>
              </Link>
            </div>

            <div className="flex-1">
              <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                <DashboardLinks />
              </nav>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default DashboardLayout
