'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import { useFormStatus } from 'react-dom'

interface ISubmitButtonProps {
  className?: string
  image?: JSX.Element
  text: string
  variant?: 'link' | 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | null | undefined
}

export function SubmitButton({ className, image, text, variant }: ISubmitButtonProps) {
  const { pending } = useFormStatus()
  return (
    <>
      {pending ? (
        <Button variant="outline" className="w-full" disabled>
          <Loader2 className="size-4 mr-2 animate-spin" /> Please wait
        </Button>
      ) : (
        <Button type="submit" variant={variant} className={cn('w-full', className)}>
          {image}
          {text}
        </Button>
      )}
    </>
  )
}
