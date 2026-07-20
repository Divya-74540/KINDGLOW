import React, { useState } from 'react';
import LandingPage from './pages/landingpage/landingpage'; 
// Points directly to the pages folder location
import DashboardLayout from './pages/dashboard/dashboardlayout'; 

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
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