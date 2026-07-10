import { Outlet } from 'react-router-dom';
import { Header } from '@/layout/Header';
import { Sidebar } from '@/layout/Sidebar';
import { Footer } from '@/layout/Footer';

export function MainLayout() {
  return (
    <div className="flex h-screen flex-col bg-shell-bg">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
}
