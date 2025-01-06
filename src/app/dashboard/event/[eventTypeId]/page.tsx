import { editEventTypeAction } from '@/app/actions'
import EventForm from '@/app/components/dashboard/EventForm'
import prisma from '@/lib/db'

import { notFound } from 'next/navigation'
import React from 'react'

async function getData(eventTypeId: string) {
  const data = await prisma.eventType.findUnique({
    where: {
      id: eventTypeId,
    },
    select: {
      title: true,
      description: true,
      duration: true,
      url: true,
      id: true,
      videoCallSoftware: true,
    },
  })

  if (!data) {
    return notFound()
  }

  return data
}

interface IEditEventPageProps {
  params: {
    eventTypeId: string
  }
}

const EditEventPage = async ({ params }: IEditEventPageProps) => {
  const { eventTypeId } = await params
  const data = await getData(eventTypeId)

  return (
    <EventForm
      buttonText="Edit Event Type"
      cardTitle="Edit your appointment type"
      cardDescription="Edit your appointment type that allows people to book times."
      description={data.description}
      duration={data.duration}
      title={data.title}
      url={data.url}
      key={data.id}
      id={data.id}
      callProvider={data.videoCallSoftware}
      onAction={editEventTypeAction}
    />
  )
}

export default EditEventPage
