'use client'

import { SubmitButton } from '@/app/components/SubmitButton'

import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/ButtonGroup'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { eventTypeSchema } from '@/lib/zodSchemas'
import { SubmissionResult, useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import Link from 'next/link'
import React, { useActionState, useState } from 'react'

type Platform = 'Zoom Meeting' | 'Google Meet' | 'Microsoft Teams'

interface IEventPageProps {
  cardTitle: string
  cardDescription: string
  buttonText: string
  title?: string
  url?: string
  id?: string
  description?: string
  duration?: number
  callProvider?: string
  isEdit?: boolean
  onAction: (
    prevState: SubmissionResult<string[]> | undefined,
    formData: FormData,
  ) => Promise<SubmissionResult<string[]>>
}

export default function EventPage({
  onAction,
  cardTitle,
  cardDescription,
  buttonText,
  title,
  id,
  url,
  description,
  duration,
  callProvider,
}: IEventPageProps) {
  const [lastResult, action] = useActionState(onAction, undefined)
  const [form, fields] = useForm({
    lastResult,

    onValidate({ formData }) {
      return parseWithZod(formData, { schema: eventTypeSchema })
    },

    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
  })
  const [activePlatform, setActivePlatform] = useState<Platform>((callProvider as Platform) || 'Google Meet')

  const togglePlatform = (platform: Platform) => {
    setActivePlatform(platform)
  }
  return (
    <div className="h-full w-full flex-1 flex flex-col items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle>{cardTitle}</CardTitle>
          <CardDescription>{cardDescription}</CardDescription>
        </CardHeader>
        <form noValidate id={form.id} onSubmit={form.onSubmit} action={action}>
          <input type="hidden" name="id" value={id} />
          <CardContent className="grid gap-y-5">
            <div className="flex flex-col gap-y-2">
              <Label>Title</Label>
              <Input
                name={fields.title.name}
                key={fields.title.key}
                defaultValue={title || fields.title.initialValue}
                placeholder="30 min meeting"
              />
              <p className="text-red-500 text-sm">{fields.title.errors}</p>
            </div>

            <div className="grid gap-y-2 ">
              <Label>URL Slug</Label>
              <div className="flex rounded-md">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-muted bg-muted text-muted-foreground text-sm">
                  AxMeetWise.com/
                </span>
                <Input
                  type="text"
                  key={fields.url.key}
                  defaultValue={url || fields.url.initialValue}
                  name={fields.url.name}
                  placeholder="example-user-1"
                  className="rounded-l-none"
                />
              </div>

              <p className="text-red-500 text-sm">{fields.url.errors}</p>
            </div>

            <div className="grid gap-y-2">
              <Label>Description</Label>
              <Textarea
                name={fields.description.name}
                key={fields.description.key}
                defaultValue={description || fields.description.initialValue}
                placeholder="30 min meeting"
              />
              <p className="text-red-500 text-sm">{fields.description.errors}</p>
            </div>

            <div className="grid gap-y-2">
              <Label>Duration</Label>
              <Select
                name={fields.duration.name}
                key={fields.duration.key}
                defaultValue={String(duration) || fields.duration.initialValue}>
                <SelectTrigger>
                  <SelectValue placeholder="Select the duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Duration</SelectLabel>
                    <SelectItem value="15">15 Mins</SelectItem>
                    <SelectItem value="30">30 Min</SelectItem>
                    <SelectItem value="45">45 Mins</SelectItem>
                    <SelectItem value="60">1 Hour</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>

              <p className="text-red-500 text-sm">{fields.duration.errors}</p>
            </div>

            <div className="grid gap-y-2">
              <input type="hidden" name={fields.videoCallSoftware.name} value={activePlatform} />
              <Label>Video Call Provider</Label>
              <ButtonGroup className="w-full">
                <Button
                  onClick={() => togglePlatform('Zoom Meeting')}
                  type="button"
                  className="w-full"
                  variant={activePlatform === 'Zoom Meeting' ? 'secondary' : 'outline'}>
                  Zoom
                </Button>
                <Button
                  onClick={() => togglePlatform('Google Meet')}
                  type="button"
                  className="w-full"
                  variant={activePlatform === 'Google Meet' ? 'secondary' : 'outline'}>
                  Google Meet
                </Button>
                <Button
                  variant={activePlatform === 'Microsoft Teams' ? 'secondary' : 'outline'}
                  type="button"
                  className="w-full"
                  onClick={() => togglePlatform('Microsoft Teams')}>
                  Microsoft Teams
                </Button>
              </ButtonGroup>
              <p className="text-red-500 text-sm">{fields.videoCallSoftware.errors}</p>
            </div>
          </CardContent>
          <CardFooter className="w-full flex justify-between">
            <Button asChild variant="secondary">
              <Link href="/dashboard">Cancel</Link>
            </Button>
            <SubmitButton className="w-fit" text={buttonText} />
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
