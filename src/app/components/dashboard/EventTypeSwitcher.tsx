'use client'

import { updateEventTypeStatusAction } from '@/app/actions'
import { Switch } from '@/components/ui/switch'
import React, { useActionState, useEffect, useTransition } from 'react'
import { toast } from 'sonner'

interface IEventTypeSwitcherProps {
  eventTypeId: string
  initialChecked: boolean
}

export function EventTypeSwitcher({ initialChecked, eventTypeId }: IEventTypeSwitcherProps) {
  const [isPending, startTransition] = useTransition()
  const [state, action] = useActionState(updateEventTypeStatusAction, undefined)

  useEffect(() => {
    if (state?.status === 'success') {
      toast.success(state.message)
    } else if (state?.status === 'error') {
      toast.error(state.message)
    }
  }, [state])

  return (
    <Switch
      defaultChecked={initialChecked}
      disabled={isPending}
      onCheckedChange={(isChecked) => {
        startTransition(() => {
          action({
            isChecked: isChecked,
            eventTypeId,
          })
        })
      }}
    />
  )
}
