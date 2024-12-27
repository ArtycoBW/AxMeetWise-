import Image from 'next/image'
import Logo from '@/../public/logo.png'

export function TitleWithLogo() {
  return (
    <>
      <Image src={Logo} alt="Logo" className="size-10" />
      <h4 className="text-3xl font-semibold">
        <span className="text-primary">Ax</span>MeetWise
      </h4>
    </>
  )
}
