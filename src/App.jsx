import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home/Home";
import Cart from "./pages/Cart/Cart";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import Footer from "./components/Footer/Footer";
import { useState, useEffect } from "react";
import LoginPopup from "./components/LoginPopup/LoginPopup";

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track auth state
  const [userData, setUserData] = useState(null); // Track user data

  useEffect(() => {
    // Check for authentication on app load
    const storedPhone = localStorage.getItem("phone"); // Retrieve phone number from localStorage
    if (storedPhone) {
      setIsAuthenticated(true);
      setUserData({ phone: storedPhone, name: "User Name" }); // Set phone to userData
    }
  }, []);

  const handleLoginSuccess = (user) => {
    // Save only phone number to localStorage
    localStorage.setItem("phone", user.phone);
    setIsAuthenticated(true);
    setUserData(user);
    setShowLogin(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("phone");
    setIsAuthenticated(false);
    setUserData(null);
  };

  return (
    <div className="app-container">
      {/* Login Popup */}
      {showLogin && (
        <LoginPopup
          onClose={() => setShowLogin(false)}
          setIsAuthenticated={setIsAuthenticated}
          setUserData={handleLoginSuccess}
        />
      )}

      {/* Navbar */}
      <Navbar
        setShowLogin={setShowLogin}
        isAuthenticated={isAuthenticated}
        userData={userData}
        onLogout={handleLogout}
      />

      {/* Routes */}
      <Routes>
        <Route path="/react-food-delivery-website" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/order" element={<PlaceOrder />} />
      </Routes>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default App;
