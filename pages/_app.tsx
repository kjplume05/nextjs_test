import { SessionProvider } from "next-auth/react"
import { Session } from "next-auth"

interface Props {
    Component: React.ComponentType,
    pageProps: { session?: Session, [key: string]: unknown}
}

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: Props) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  )
}