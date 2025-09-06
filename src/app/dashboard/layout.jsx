import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";

export default function DashboardLayout({ children }) {
  return (
    <>
      <div className="grid grid-cols-12 grid-rows-12 gap-0  h-screen  ">
        <div className="col-span-12 row-span-1 overflow-hidden"><TopNav /></div>
        <div className="col-span-2 row-span-11  overflow-hidden"><Sidebar /></div>
        <div className="col-span-10 row-span-11  overflow-y-hidden  ">{children}</div>
      </div>
    </>
  );
} 
