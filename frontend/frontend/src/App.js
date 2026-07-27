import React, { useState, useEffect } from 'react';
// Ensure these match their respective files' export styles:
import LandingPage from './pages/landingpage/landingpage'; 
import DashboardLayout from './pages/dashboard/dashboardlayout';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check for an existing token on initial load so page refreshes don't reset login state
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <div className="App">
      {isLoggedIn ? (
        <DashboardLayout onLogout={() => {
          localStorage.removeItem("token");
          setIsLoggedIn(false);
        }} />
      ) : (
        <LandingPage onLoginSuccess={() => setIsLoggedIn(true)} />
      )}
    </div>
  );
}

export default App;