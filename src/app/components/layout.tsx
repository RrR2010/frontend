import type { Metadata } from "next"
import "@/app/globals.css"

export const metadata: Metadata = {
  title: "Component Testing",
  description: "Preview and test all UI components from the design system",
}

export default function ComponentsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  )
}