import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog'
import { TitleWithLogo } from './TitleWithLogo'
import { signIn } from '@/lib/auth'
import { SignInButton } from './SignInButton'
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
            <SignInButton title={'google'} logo={GoogleLogo} />
          </form>
          <form
            action={async () => {
              'use server'
              await signIn('google')
            }}>
            <SignInButton title={'github'} logo={GithubLogo} />
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
