import { Button } from '@/components/ui/button'
import prisma from '@/lib/db'
import { nylas } from '@/lib/nylas'
import { Prisma } from '@prisma/client'
import Link from 'next/link'
import { addMinutes, format, fromUnixTime, isAfter, isBefore, parse } from 'date-fns'
import { GetFreeBusyResponse, NylasResponse } from 'nylas'

async function getData(selectedDate: Date, userName: string) {
  const currentDay = format(selectedDate, 'EEEE')

  const startOfDay = new Date(selectedDate)
  startOfDay.setHours(0, 0, 0, 0)
  const endOfDay = new Date(selectedDate)
  endOfDay.setHours(23, 59, 59, 999)
  const data = await prisma.availability.findFirst({
    where: {
      day: currentDay as Prisma.EnumDayFilter,
      user: {
        userName: userName,
      },
    },
    select: {
      fromTime: true,
      tillTime: true,
      id: true,
      user: {
        select: {
          grantEmail: true,
          grantId: true,
        },
      },
    },
  })

  const nylasCalendarData = await nylas.calendars.getFreeBusy({
    identifier: data?.user?.grantId as string,
    requestBody: {
      startTime: Math.floor(startOfDay.getTime() / 1000),
      endTime: Math.floor(endOfDay.getTime() / 1000),
      emails: [data?.user?.grantEmail as string],
    },
  })

  return { data, nylasCalendarData }
}

function calculateAvailableTimeSlots(
  dbAvailability: {
    fromTime: string | undefined
    tillTime: string | undefined
  },
  nylasData: NylasResponse<GetFreeBusyResponse[]>,
  date: string,
  duration: number,
) {
  const now = new Date()

  const availableFrom = parse(`${date} ${dbAvailability.fromTime}`, 'yyyy-MM-dd HH:mm', new Date())
  const availableTill = parse(`${date} ${dbAvailability.tillTime}`, 'yyyy-MM-dd HH:mm', new Date())

  // todo пофиксить ts ошибки и убрать по максимуму приведение типов в файле и проекте в целом
  const busySlots = nylasData.data[0].timeSlots.map((slot) => ({
    start: fromUnixTime(slot.startTime),
    end: fromUnixTime(slot.endTime),
  }))

  const allSlots = []
  let currentSlot = availableFrom
  while (isBefore(currentSlot, availableTill)) {
    allSlots.push(currentSlot)
    currentSlot = addMinutes(currentSlot, duration)
  }

  const freeSlots = allSlots.filter((slot) => {
    const slotEnd = addMinutes(slot, duration)
    return (
      isAfter(slot, now) &&
      !busySlots.some(
        (busy: { start: Date; end: Date }) =>
          (!isBefore(slot, busy.start) && isBefore(slot, busy.end)) ||
          (isAfter(slotEnd, busy.start) && !isAfter(slotEnd, busy.end)) ||
          (isBefore(slot, busy.start) && isAfter(slotEnd, busy.end)),
      )
    )
  })

  return freeSlots.map((slot) => format(slot, 'HH:mm'))
}

interface ITimeTable {
  selectedDate: Date
  userName: string
  meetingDuration: number
}

export default async function TimeTable({ selectedDate, userName, meetingDuration }: ITimeTable) {
  const { data, nylasCalendarData } = await getData(selectedDate, userName)

  const dbAvailability = { fromTime: data?.fromTime, tillTime: data?.tillTime }

  const formattedDate = format(selectedDate, 'yyyy-MM-dd')

  const availableSlots = calculateAvailableTimeSlots(dbAvailability, nylasCalendarData, formattedDate, meetingDuration)

  return (
    <div>
      <p className="text-base font-semibold">
        {format(selectedDate, 'EEE')}.{' '}
        <span className="text-sm text-muted-foreground">{format(selectedDate, 'MMM. d')}</span>
      </p>

      <div className="mt-3 max-h-[350px] overflow-y-auto">
        {availableSlots.length > 0 ? (
          availableSlots.map((slot, index) => (
            <Link key={index} href={`?date=${format(selectedDate, 'yyyy-MM-dd')}&time=${slot}`}>
              <Button variant="outline" className="w-full mb-2">
                {slot}
              </Button>
            </Link>
          ))
        ) : (
          <p>No available time slots for this date.</p>
        )}
      </div>
    </div>
  )
}
