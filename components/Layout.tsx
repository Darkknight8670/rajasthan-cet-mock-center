
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  showNav?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, showNav = true }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {showNav && (
        <header className="bg-orange-600 text-white shadow-lg sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-graduation-cap text-2xl"></i>
              <h1 className="text-xl font-bold tracking-tight">Raj-CET Mock Center</h1>
            </div>
            <nav className="hidden md:flex gap-6 font-medium">
              <a href="#" className="hover:text-orange-200 transition">Tests</a>
              <a href="#" className="hover:text-orange-200 transition">Syllabus</a>
              <a href="#" className="hover:text-orange-200 transition">Performance</a>
            </nav>
            <div className="flex items-center gap-4">
              <button className="bg-white text-orange-600 px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-orange-50 transition">
                Login
              </button>
            </div>
          </div>
        </header>
      )}
      <main className="flex-grow">
        {children}
      </main>
      <footer className="bg-slate-900 text-slate-400 py-8 text-center text-sm">
        <div className="max-w-7xl mx-auto px-4">
          <p>© 2024 Raj-CET Mock Center. Focused on Rajasthan Student Success.</p>
          <p className="mt-2">Made with ❤️ for aspirants of CET (Senior Secondary & Graduate Level)</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
