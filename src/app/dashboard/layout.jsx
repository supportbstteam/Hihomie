
import Sidebar from '@/components/Sidebar'
import TopNav from '@/components/TopNav'

export default function DashboardLayout({ children }) {
  return (
    <>
      <TopNav />

      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1">
          {/* Main Content */}
          <div className="">
            {children}
          </div>
        </div>
      </div>
    </>
  )
}
