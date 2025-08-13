'use client'

import { ReactNode } from 'react'
import Header from './Header'
import Footer from './Footer'
import { Toaster } from '@/components/ui/sonner'

interface LayoutProps {
  children: ReactNode
  showFooter?: boolean
}

export default function Layout({ children, showFooter = true }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      {showFooter && <Footer />}
      <Toaster 
        position="top-center" 
        richColors 
        closeButton
        toastOptions={{
          style: {
            fontFamily: 'inherit',
          },
        }}
      />
    </div>
  )
}

