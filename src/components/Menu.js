'use client'
import { useState } from "react"
import Sidebar from "./Sidebar"
import TopNav from "./TopNav"

export default function Layout({ children }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar open={open} setOpen={setOpen} />

      <div className="flex-1">
        {/* Navbar */}
        <TopNav open={open} setOpen={setOpen} />

        {/* Main Content */}
        <main className="p-4">{children}</main>
      </div>
    </div>
  )
}
