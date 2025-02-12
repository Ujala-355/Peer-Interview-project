import React, { useState } from 'react';
import { Header } from './components/Header';
import { InterviewRequestForm } from './components/InterviewRequestForm';
import { InterviewList } from './components/InterviewList';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLogin } from './AdminLogin';

function App() {
  const [view, setView] = useState<'candidate' | 'admin' | 'login'>('candidate');
  const isAuthenticated = localStorage.getItem('adminAuth') === 'true';

  const handleViewSwitch = () => {
    if (view === 'candidate') {
      setView(isAuthenticated ? 'admin' : 'login');
    } else {
      setView('candidate');
    }
  };

  const handleLoginSuccess = () => {
    setView('admin');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6 flex justify-between items-center">
            <div className="flex-1"></div>
            <button
              onClick={handleViewSwitch}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Switch to {view === 'candidate' ? 'Admin' : 'Candidate'} View
            </button>
            {isAuthenticated && view === 'admin' && (
              <button
                onClick={() => {
                  localStorage.removeItem('adminAuth');
                  localStorage.removeItem('adminToken');
                  setView('candidate');
                }}
                className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                Logout
              </button>
            )}
          </div>

          {view === 'candidate' ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="md:col-span-1">
                <InterviewRequestForm />
              </div>
              <div className="md:col-span-2">
                <InterviewList />
              </div>
            </div>
          ) : view === 'login' ? (
            <AdminLogin onLoginSuccess={handleLoginSuccess} />
          ) : (
            <AdminDashboard />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
