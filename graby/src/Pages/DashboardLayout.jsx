import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut } from 'lucide-react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase';

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/auth');
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile Top Navbar */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white shadow-md z-50 flex items-center justify-between px-4 py-3">
        <h2 className="text-xl font-bold">Dashboard</h2>
        <div className="flex items-center gap-4">
          {user?.photoURL && (
            <img
              src={user.photoURL}
              alt="User Avatar"
              className="h-8 w-8 rounded-full object-cover"
            />
          )}
          <button onClick={toggleSidebar}>
            {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed md:static top-14 md:top-0 left-0 z-40 bg-white shadow-md transition-transform duration-300 w-64 h-full ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-6 flex flex-col h-full justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-8 hidden md:block text-center">Dashboard</h2>
            <nav className="space-y-4">
              {user?.photoURL && (
                <div className="flex items-center gap-3 border-t pt-4 mb-4">
                  <img
                    src={user.photoURL}
                    alt="User Avatar"
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div className="flex flex-col">
                    <span className="font-semibold">{user?.displayName || 'User'}</span>
                  </div>
                </div>
              )}

              <Link
                to="/"
                className={`block px-4 py-2 rounded ${
                  location.pathname === '/'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-700 hover:bg-blue-100'
                }`}
              >
                Home
              </Link>
              <Link
                to="/profile"
                className={`block px-4 py-2 rounded ${
                  location.pathname === '/profile'
                    ? 'bg-black text-white'
                    : 'text-gray-700 hover:bg-blue-100'
                }`}
              >
                Dashboard
              </Link>

              <button
                onClick={() => navigate('/profile?view=analytics')}
                className="w-full text-left px-4 py-2 rounded text-gray-700 hover:bg-blue-100"
              >
                View Analytics
              </button>

              <Link
                to="/pricing"
                className={`block px-4 py-2 rounded ${
                  location.pathname === '/pricing'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-700 hover:bg-blue-100'
                }`}
              >
                Buy Credits
              </Link>

              {/* Logout button after Buy Credits */}
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 rounded text-red-600 hover:bg-red-100 flex items-center gap-2"
              >
                Logout <LogOut className="h-5 w-5" />
              </button>
            </nav>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 mt-14 md:mt-0 overflow-y-auto p-6 bg-gray-50 relative">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
