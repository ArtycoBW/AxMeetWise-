import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog'
import { TitleWithLogo } from '../TitleWithLogo'
import { signIn } from '@/lib/auth'
import Image from 'next/image'
import { SubmitButton } from '../SubmitButton'
import GithubLogo from '@/../public/github.svg'
import GoogleLogo from '@/../public/google.svg'

export function AuthModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Try for Free</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[360px]">
        <DialogHeader className="flex flex-row justify-center items-center gap-2">
          <TitleWithLogo />
        </DialogHeader>
        <div className="flex flex-col mt-5 gap-3">
          <form
            action={async () => {
              // TODO рассмотреть возможность вынести отдельно
              'use server'
              await signIn('google')
            }}>
            <SubmitButton
              text={'Sign in with Google'}
              image={<Image src={GoogleLogo} className="size-4 mr-2 dark:invert" alt={'Google Logo'} />}
              variant="outline"
            />
          </form>
          <form
            action={async () => {
              'use server'
              await signIn('google')
            }}>
            <SubmitButton
              text={'Sign in with Github'}
              image={<Image src={GithubLogo} className="size-4 mr-2 dark:invert" alt={'Github Logo'} />}
              variant="outline"
            />
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
