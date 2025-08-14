'use client'
import { Provider } from 'react-redux'
import { store } from '@/store'
import { SessionProvider } from 'next-auth/react'
import { Toaster } from "react-hot-toast"

export default function Providers({ children }) {
  return (
    <SessionProvider>
      <Provider store={store}>{children}</Provider>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    </SessionProvider>
  )
}
