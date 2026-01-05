import { useState, useEffect } from 'react';
import { authAPI } from './services/api';
import Login from './components/Login';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import MenuManager from './components/MenuManager';

function App() {
  const [user, setUser] = useState(null);
  const [activeView, setActiveView] = useState('dashboard');

  useEffect(() => {
    // Check if user is already logged in
    const currentUser = authAPI.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    authAPI.logout();
    setUser(null);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onLogout={handleLogout} />
      
      {/* Navigation */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveView('dashboard')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeView === 'dashboard'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Order Dashboard
            </button>
            <button
              onClick={() => setActiveView('menu')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeView === 'menu'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Menu Management
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main>
        {activeView === 'dashboard' && <Dashboard />}
        {activeView === 'menu' && <MenuManager />}
      </main>
    </div>
  );
}

export default App;