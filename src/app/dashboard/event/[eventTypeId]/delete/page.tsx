import { deleteEventTypeAction } from '@/app/actions'
import { SubmitButton } from '@/app/components/SubmitButton'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import React from 'react'

interface IDeleteEventTypePageProps {
  params: {
    eventTypeId: string
  }
}

const DeleteEventTypePage = ({ params }: IDeleteEventTypePageProps) => {
  return (
    <div className="flex-1 flex items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle>Delete Event Type</CardTitle>
          <CardDescription>Are you sure you want to delete this event type?</CardDescription>
        </CardHeader>
        <CardFooter className="w-full flex justify-between">
          <Button asChild variant="secondary">
            <Link href="/dashboard">Cancel</Link>
          </Button>
          <form action={deleteEventTypeAction}>
            <input type="hidden" name="id" value={params.eventTypeId} />
            <SubmitButton variant="destructive" text="Delete Event" />
          </form>
        </CardFooter>
      </Card>
    </div>
  )
}

export default DeleteEventTypePage
