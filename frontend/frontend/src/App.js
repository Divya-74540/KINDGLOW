import React, { useState } from 'react';
// Ensure these match their respective files' export styles:
import LandingPage from './pages/landingpage/landingpage'; 
import DashboardLayout from './pages/dashboard/dashboardlayout';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="App">
      {isLoggedIn ? (
        <DashboardLayout onLogout={() => setIsLoggedIn(false)} />
      ) : (
        <LandingPage onLoginSuccess={() => setIsLoggedIn(true)} />
      )}
    </div>
  );
}

export default App;