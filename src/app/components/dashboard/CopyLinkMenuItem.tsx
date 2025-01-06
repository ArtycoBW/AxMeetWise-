'use client'

import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { Link2 } from 'lucide-react'
import { toast } from 'sonner'

interface ICopyLinkMenuItemProps {
  meetingUrl: string
}

export function CopyLinkMenuItem({ meetingUrl }: ICopyLinkMenuItemProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(meetingUrl)
      toast.success('URL copied to clipboard')
    } catch (err) {
      console.error('Could not copy text: ', err)
      toast.error('Failed to copy URL')
    }
  }

  return (
    <DropdownMenuItem asChild onSelect={handleCopy}>
      <span>
        <Link2 className="mr-2 h-4 w-4" />
        Copy
      </span>
    </DropdownMenuItem>
  )
}
