import React, { FC, ReactNode } from 'react'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

const MainLayout: FC<{ children: ReactNode | ReactNode[] }> = ({
  children,
}) => {
  return (
    <section className="flex flex-col items-center min-h-screen" style={inter.style}>
      <div className="max-w-6xl w-full p-4 sm:p-2 flex flex-col gap-5">{children}</div>
    </section>
  )
}

export default MainLayout
