'use client'

import { useActionState, useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { SubmitButton } from '../components/SubmitButton'
import Image from 'next/image'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { settingsSchema } from '@/lib/zodSchemas'
import { UploadDropzone } from '@/lib/uploadthing'
import { settingsAction } from '../actions'

interface ISettingsFormProps {
  fullName: string
  email: string
  profileImage: string
}

export function SettingsForm({ fullName, email, profileImage }: ISettingsFormProps) {
  const [lastResult, action] = useActionState(settingsAction, undefined)
  const [currentProfileImage, setCurrentProfileImage] = useState(profileImage)

  const [form, fields] = useForm({
    lastResult,

    onValidate({ formData }) {
      return parseWithZod(formData, { schema: settingsSchema })
    },

    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
  })

  const handleDeleteImage = () => {
    setCurrentProfileImage('')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <CardDescription>Manage your account settings.</CardDescription>
      </CardHeader>
      <form noValidate id={form.id} onSubmit={form.onSubmit} action={action}>
        <CardContent className="flex flex-col gap-y-4">
          <div className="flex flex-col gap-y-2">
            <Label>Full Name</Label>
            <Input
              name={fields.fullName.name}
              key={fields.fullName.key}
              placeholder="Jan Marshall"
              defaultValue={fullName}
            />
            <p className="text-red-500 text-sm">{fields.fullName.errors}</p>
          </div>
          <div className="flex flex-col gap-y-2">
            <Label>Email</Label>
            <Input disabled placeholder="Jan Marshall" defaultValue={email} />
          </div>

          <div className="grid gap-y-5">
            <Label>Profile Image</Label>
            <input
              type="hidden"
              name={fields.profileImage.name}
              key={fields.profileImage.key}
              value={currentProfileImage}
            />
            {currentProfileImage ? (
              <div className="relative size-16">
                <Image
                  src={currentProfileImage}
                  alt="Profile"
                  width={300}
                  height={300}
                  className="rounded-lg size-16"
                />
                <Button
                  type="button"
                  onClick={handleDeleteImage}
                  variant="destructive"
                  size="icon"
                  className="absolute -top-3 -right-3">
                  <X className="size-4" />
                </Button>
              </div>
            ) : (
              <UploadDropzone
                endpoint="imageUploader"
                appearance={{
                  container: 'border-muted',
                }}
                onClientUploadComplete={(res) => {
                  setCurrentProfileImage(res[0].url)
                  toast.success('Profile image uploaded')
                }}
                onUploadError={(error) => {
                  toast.error(error.message)
                }}
              />
            )}
            <p className="text-red-500 text-sm">{fields.profileImage.errors}</p>
          </div>
        </CardContent>
        <CardFooter>
          <SubmitButton text="Save Changes" />
        </CardFooter>
      </form>
    </Card>
  )
}
