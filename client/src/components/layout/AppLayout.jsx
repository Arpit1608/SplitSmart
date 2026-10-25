import { Outlet } from 'react-router-dom';
import MobileNav from './MobileNav';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

// The frame around every logged-in page. <Outlet /> is where the current page renders.
export default function AppLayout() {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main">
        <Topbar />
        <div className="content">
          <Outlet />
        </div>
      </main>
      <MobileNav />
    </div>
  );
}
