import GlobalLoader from '@/components/GlobalLoader'
import './globals.css'
import Providers from './providers'
import { Inter, } from "next/font/google";
export const metadata = { title: 'HiHomie - Hipoteca' }

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["100","200","300","400","500", "600", "700","800","900"], // add any weights you want
  display: "swap",
});

export default function RootLayout({ children }) {
  return (
     <html lang="en" className={`${inter.variable}`}>
      <body className="">
         <Providers>{children}</Providers>
      </body>
    </html>
  )
}
