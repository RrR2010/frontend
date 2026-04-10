import { AuthProvider } from '@/contexts/AuthContext'
import '@/app/globals.css'
import { Geist, Inter } from "next/font/google";
import { cn } from "@/lib/utils";

const interHeading = Inter({subsets:['latin'],variable:'--font-heading'});

const geist = Geist({subsets:['latin'],variable:'--font-sans'});


export default function RootLayout({ children: children }: { children: React.ReactNode }) {
  return (
    <html className={cn("font-sans", geist.variable, interHeading.variable)}>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}