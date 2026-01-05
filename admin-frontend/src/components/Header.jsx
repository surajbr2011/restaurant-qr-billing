import React from 'react';

function Header({ user, activeView, setActiveView, onLogout }) {
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Restaurant Admin</h1>
        
        {user && (
          <div className="flex items-center gap-6">
            <nav className="flex gap-4">
              <button
                onClick={() => setActiveView('dashboard')}
                className={`px-3 py-2 rounded-md ${
                  activeView === 'dashboard'
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveView('menu')}
                className={`px-3 py-2 rounded-md ${
                  activeView === 'menu'
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Menu
              </button>
            </nav>
            
            <div className="flex items-center gap-4">
              <span className="text-gray-700">Welcome, {user.name}</span>
              <button
                onClick={onLogout}
                className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;