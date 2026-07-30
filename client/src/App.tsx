import React, { useState } from 'react';
import { Shield, Home, Users } from 'lucide-react';
import HomePage from './pages/HomePage';
import VolunteerDashboard from './components/VolunteerDashboard';

type AppView = 'home' | 'volunteer';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('home');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">AI Guardian Angel</span>
            </div>
            
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentView('home')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  currentView === 'home'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Home className="w-4 h-4" />
                Emergency Help
              </button>
              <button
                onClick={() => setCurrentView('volunteer')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  currentView === 'volunteer'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Users className="w-4 h-4" />
                Volunteer Dashboard
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        {currentView === 'home' && <HomePage />}
        {currentView === 'volunteer' && <VolunteerDashboard />}
      </main>

      {/* Emergency Footer */}
      <footer className="bg-red-600 text-white py-4">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="font-semibold">
            🚨 For immediate life-threatening emergencies, call 911 directly 🚨
          </p>
          <p className="text-red-100 text-sm mt-1">
            This app provides guidance and support but does not replace professional emergency services
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;