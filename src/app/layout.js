import GlobalLoader from '@/components/GlobalLoader'
import './globals.css'
import Providers from './providers'

export const metadata = { title: 'HiHomie - Hipoteca' }
import { Inter, } from "next/font/google";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["100","200","300","400","500", "600", "700","800","900"], // add any weights you want
  display: "swap",
});
export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className="bg-gray-50 text-gray-900">
         <Providers>{children}</Providers>
      {/* <GlobalLoader>
       
      </GlobalLoader> */}
      </body>
    </html>
  )
}
