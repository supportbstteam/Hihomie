
import Sidebar from '@/components/Sidebar'
import TopNav from '@/components/TopNav'

export default function DashboardLayout({ children }) {
  return (
    <>
      <TopNav />

      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 p-6">
          {/* LowerNav content ke upar */}
         

          {/* Main Content */}
          <div className="mt-4">
            {children}
          </div>
        </div>
      </div>
    </>
  )
}
