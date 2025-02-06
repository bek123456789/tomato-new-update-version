import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Login from './components/Login';
import AdminHome from './components/AdminHome';
import Orders from './components/Orders';
import './styles.css';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
  }, []);

  return (
    <Router>
      <div className="app-container">
        {isLoggedIn && <Sidebar />}
        <div className="content-container">
          <Routes>
            <Route path="/" element={isLoggedIn ? <Navigate to="/admin" /> : <Login setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/admin" element={isLoggedIn ? <AdminHome /> : <Navigate to="/" />} />
            <Route path="/orders" element={isLoggedIn ? <Orders /> : <Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
