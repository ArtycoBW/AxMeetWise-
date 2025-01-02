import { SettingsForm } from '@/app/components/SettingsForm'
import prisma from '@/lib/db'
import requireUser from '@/lib/hooks'
import { notFound } from 'next/navigation'
import React from 'react'

async function getData(id?: string) {
  const data = await prisma.user.findUnique({
    where: {
      id: id,
    },
    select: {
      name: true,
      email: true,
      image: true,
    },
  })

  if (!data) {
    return notFound()
  }

  return data
}

const SettingsPage = async () => {
  const session = await requireUser()
  const data = await getData(session.user?.id)
  // todo попробовать избавиться от приведения типов (в других местах тоже)
  return <SettingsForm email={data.email} fullName={data?.name as string} profileImage={data?.image as string} />
}

export default SettingsPage