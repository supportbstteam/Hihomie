import GlobalLoader from '@/components/GlobalLoader'
import './globals.css'
import Providers from './providers'

export const metadata = { title: 'HiHomie - Hipoteca' }

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
         <Providers>{children}</Providers>
      {/* <GlobalLoader>
       
      </GlobalLoader> */}
      </body>
    </html>
  )
}
