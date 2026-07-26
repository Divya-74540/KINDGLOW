import React, { useState } from 'react';
import LandingPage from './pages/landingpage/landingpage'; 
import DashboardLayout from './pages/dashboard/dashboardlayout'; 

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return Boolean(localStorage.getItem('token'));
  });

  const handleLoginSuccess = (token) => {
    if (token) {
      localStorage.setItem('token', token);
    }
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('access_token');
    setIsLoggedIn(false);
  };

  return (
    <div className="app-root-container">
      {isLoggedIn ? (
        <DashboardLayout onLogout={handleLogout} />
      ) : (
        <LandingPage onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}

export default App;