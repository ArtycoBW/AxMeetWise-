'use server'

import prisma from '@/lib/db'
import requireUser from '@/lib/hooks'
import { nylas } from '@/lib/nylas'
import { eventTypeSchema, onboardingSchemaValidation, settingsSchema } from '@/lib/zodSchemas'
import { SubmissionResult } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { Details } from 'nylas'

export async function onboardingAction(prevState: SubmissionResult<string[]> | undefined, formData: FormData) {
  const session = await requireUser()

  const submission = await parseWithZod(formData, {
    schema: onboardingSchemaValidation({
      isUsernameUnique: async () => {
        const existingUserName = await prisma.user.findUnique({
          where: { userName: formData.get('userName') as string },
        })

        return !existingUserName
      },
    }),

    async: true,
  })

  if (submission.status !== 'success') {
    return submission.reply()
  }

  const data = await prisma.user.update({
    where: { id: session.user?.id },
    data: {
      userName: submission.value.userName,
      name: submission.value.fullName,
      availability: {
        createMany: {
          data: [
            {
              day: 'Monday',
              fromTime: '08:00',
              tillTime: '18:00',
            },
            {
              day: 'Tuesday',
              fromTime: '08:00',
              tillTime: '18:00',
            },
            {
              day: 'Wednesday',
              fromTime: '08:00',
              tillTime: '18:00',
            },
            {
              day: 'Thursday',
              fromTime: '08:00',
              tillTime: '18:00',
            },
            {
              day: 'Friday',
              fromTime: '08:00',
              tillTime: '18:00',
            },
            {
              day: 'Saturday',
              fromTime: '08:00',
              tillTime: '18:00',
            },
            {
              day: 'Sunday',
              fromTime: '08:00',
              tillTime: '18:00',
            },
          ],
        },
      },
    },
  })

  return redirect('/onboarding/grant-id')
}

export async function settingsAction(prevState: SubmissionResult<string[]> | undefined, formData: FormData) {
  const session = await requireUser()

  const submission = parseWithZod(formData, {
    schema: settingsSchema,
  })

  if (submission.status !== 'success') {
    return submission.reply()
  }

  const user = await prisma.user.update({
    where: {
      id: session.user?.id as string,
    },
    data: {
      name: submission.value.fullName,
      image: submission.value.profileImage,
    },
  })

  return redirect('/dashboard')
}

export async function updateAvailabilityAction(formData: FormData) {
  const session = await requireUser()

  const rawData = Object.fromEntries(formData.entries())
  const availabilityData = Object.keys(rawData)
    .filter((key) => key.startsWith('id-'))
    .map((key) => {
      const id = key.replace('id-', '')
      return {
        id,
        isActive: rawData[`isActive-${id}`] === 'on',
        fromTime: rawData[`fromTime-${id}`] as string,
        tillTime: rawData[`tillTime-${id}`] as string,
      }
    })

  try {
    await prisma.$transaction(
      availabilityData.map((item) =>
        prisma.availability.update({
          where: { id: item.id },
          data: {
            isActive: item.isActive,
            fromTime: item.fromTime,
            tillTime: item.tillTime,
          },
        }),
      ),
    )

    revalidatePath('/dashboard/availability')
    return { status: 'success', message: 'Availability updated successfully' }
  } catch (error) {
    console.error('Error updating availability:', error)
    return { status: 'error', message: 'Failed to update availability' }
  }
}

export async function createEventTypeAction(prevState: SubmissionResult<string[]> | undefined, formData: FormData) {
  const session = await requireUser()

  const submission = await parseWithZod(formData, {
    schema: eventTypeSchema,
  })
  if (submission.status !== 'success') {
    return submission.reply()
  }

  await prisma.eventType.create({
    data: {
      title: submission.value.title,
      duration: submission.value.duration,
      url: submission.value.url,
      description: submission.value.description,
      userId: session.user?.id as string,
      videoCallSoftware: submission.value.videoCallSoftware,
    },
  })

  return redirect('/dashboard')
}

export async function editEventTypeAction(prevState: SubmissionResult<string[]> | undefined, formData: FormData) {
  const session = await requireUser()

  const submission = await parseWithZod(formData, {
    schema: eventTypeSchema,
  })

  if (submission.status !== 'success') {
    return submission.reply()
  }

  const data = await prisma.eventType.update({
    where: {
      id: formData.get('id') as string,
      userId: session.user?.id as string,
    },
    data: {
      title: submission.value.title,
      duration: submission.value.duration,
      url: submission.value.url,
      description: submission.value.description,
      videoCallSoftware: submission.value.videoCallSoftware,
    },
  })

  return redirect('/dashboard')
}

export async function deleteEventTypeAction(formData: FormData) {
  const session = await requireUser()

  const data = await prisma.eventType.delete({
    where: {
      id: formData.get('id') as string,
      userId: session.user?.id as string,
    },
  })

  return redirect('/dashboard')
}

interface IUpdateEventTypeStatusActionModel {
  eventTypeId: string
  isChecked: boolean
}

export async function updateEventTypeStatusAction(
  prevState: any,
  // TODO: пофиксить, убрать any
  // SubmissionResult<{
  //     status: 'error' | 'success'
  //     message: string
  //   }>
  // | undefined,
  { eventTypeId, isChecked }: IUpdateEventTypeStatusActionModel,
) {
  try {
    const session = await requireUser()

    const data = await prisma.eventType.update({
      where: {
        id: eventTypeId,
        userId: session.user?.id as string,
      },
      data: {
        active: isChecked,
      },
    })

    revalidatePath(`/dashboard`)
    return {
      status: 'success',
      message: 'EventType Status updated successfully',
    }
  } catch (error) {
    return {
      status: 'error',
      message: 'Something went wrong',
    }
  }
}

export async function createMeetingAction(formData: FormData) {
  const getUserData = await prisma.user.findUnique({
    where: {
      userName: formData.get('username') as string,
    },
    select: {
      grantEmail: true,
      grantId: true,
    },
  })

  if (!getUserData) {
    throw new Error('User not found')
  }

  // todo пофиксить ts ошибки и убрать по максимуму приведение типов
  const eventTypeData = await prisma.eventType.findUnique({
    where: {
      id: formData.get('eventTypeId') as string,
    },
    select: {
      title: true,
      description: true,
    },
  })

  const formTime = formData.get('fromTime') as string
  const meetingLength = Number(formData.get('meetingLength'))
  const provider = formData.get('provider')
  const eventDate = formData.get('eventDate') as string

  const startDateTime = new Date(`${eventDate}T${formTime}:00`)

  const endDateTime = new Date(startDateTime.getTime() + meetingLength * 60000)

  await nylas.events.create({
    identifier: getUserData?.grantId as string,
    requestBody: {
      title: eventTypeData?.title,
      description: eventTypeData?.description,
      when: {
        startTime: Math.floor(startDateTime.getTime() / 1000),
        endTime: Math.floor(endDateTime.getTime() / 1000),
      },
      conferencing: {
        autocreate: {},
        provider: provider as Details['provider'],
      },
      participants: [
        {
          name: formData.get('name') as string,
          email: formData.get('email') as string,
          status: 'yes',
        },
      ],
    },
    queryParams: {
      calendarId: getUserData?.grantEmail as string,
      notifyParticipants: true,
    },
  })

  return redirect(`/success`)
}

export async function cancelMeetingAction(formData: FormData) {
  const session = await requireUser()

  const userData = await prisma.user.findUnique({
    where: {
      id: session.user?.id as string,
    },
    select: {
      grantEmail: true,
      grantId: true,
    },
  })

  if (!userData) {
    throw new Error('User not found')
  }

  const data = await nylas.events.destroy({
    eventId: formData.get('eventId') as string,
    identifier: userData?.grantId as string,
    queryParams: {
      calendarId: userData?.grantEmail as string,
    },
  })

  revalidatePath('/dashboard/meetings')
}
