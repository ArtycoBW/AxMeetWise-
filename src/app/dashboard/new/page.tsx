import { createEventTypeAction } from '@/app/actions'
import EventForm from '@/app/components/dashboard/EventForm'

export default function NewEventPage() {
  return (
    <EventForm
      buttonText="Create Event Type"
      cardTitle="Add new appointment type"
      cardDescription="Create a new appointment type that allows people to book times."
      onAction={createEventTypeAction}
    />
  )
}
