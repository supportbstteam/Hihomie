
import Sidebar from '@/components/Sidebar'
import TopNav from '@/components/TopNav'

export default function DashboardLayout({ children }) {
  return (
    <>
      <TopNav />

      <div className="flex h-[90vh]">
        <Sidebar />
        <div className="flex-1">
          {/* Main Content */}
          <div className=" h-full">
            {children}
          </div>
        </div>
      </div>
    </>
  )
}
