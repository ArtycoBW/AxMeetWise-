'use server'

import prisma from '@/lib/db'
import requireUser from '@/lib/hooks'
import { onboardingSchemaValidation, settingsSchema } from '@/lib/zodSchemas'
import { SubmissionResult } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { redirect } from 'next/navigation'

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
    data: { userName: submission.value.userName, name: submission.value.fullName },
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
