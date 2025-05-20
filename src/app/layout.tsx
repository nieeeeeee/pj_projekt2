import { ReactNode } from 'react'
import SessionWrapper from './_components/SessionWrapper'

export const metadata = {
  title: 'balls',
  description: 'balls',
}

export default function RootLayout({
                                     children,
                                   }: {
  children: ReactNode
}) {
  return (
    <html lang="en">
    <body>
    <SessionWrapper>{children}</SessionWrapper>
    </body>
    </html>
  )
}
