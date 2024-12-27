'use client'

import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import Image from 'next/image'
import { useFormStatus } from 'react-dom'

interface ISignInButtonProps {
  logo: string
  title: string
}

export function SignInButton({ logo, title }: ISignInButtonProps) {
  const { pending } = useFormStatus()
  return (
    <>
      {pending ? (
        <Button variant="outline" className="w-full" disabled>
          <Loader2 className="size-4 mr-2 animate-spin" /> Please wait
        </Button>
      ) : (
        <Button variant="outline" className="w-full">
          <Image src={logo} className="size-4 mr-2 dark:invert" alt={`${title} Logo`} />
          {`Sign in with ${title}`}
        </Button>
      )}
    </>
  )
}
