import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* TopNav: Stays fixed at the top */}
      <div>
        <TopNav />
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar: Stays fixed on the left */}
        <div className="w-64 flex-shrink-0 bg-white">
          <Sidebar />
        </div>

        {/* Main Content: Takes remaining space and is the only scrollable area */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}