import "./Navbar.css";
import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";

const Navbar = ({ setShowLogin, setIsAuthenticated, setUserData }) => {
  const [menu, setMenu] = useState("home");
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const { getTotalCartAmount } = useContext(StoreContext);
  const [isAuthenticatedState, setIsAuthenticatedState] = useState(false);
  const [userDataState, setUserDataState] = useState(null);

  const bearerToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRfcGxhdGZvcm1faWQiOiIiLCJjbGllbnRfdHlwZV9pZCI6ImYzODMyMzdiLTJmM2YtNDkyMC1iMDcwLWM4M2E4ZjM3YTZlNyIsImRhdGEiOiJNb3ppbGxhLzUuMCAoV2luZG93cyBOVCAxMC4wOyBXaW42NDsgeDY0KSBBcHBsZVdlYktpdC81MzcuMzYgKEtIVE1MLCBsaWtlIEdlY2tvKSBDaHJvbWUvMTMxLjAuMC4wIFNhZmFyaS81MzcuMzYiLCJleHAiOjE3MzgyNTU5OTMsImlhdCI6MTczODE2OTU5MywiaWQiOiJhOThkZTMwMy00OTNmLTQ0MjYtOGU0OC0yY2E2YzA1ZjRlMzAiLCJpcCI6Ik1vemlsbGEvNS4wIChXaW5kb3dzIE5UIDEwLjA7IFdpbjY0OyB4NjQpIEFwcGxlV2ViS2l0LzUzNy4zNiAoS0hUTUwsIGxpa2UgR2Vja28pIENocm9tZS8xMzEuMC4wLjAgU2FmYXJpLzUzNy4zNiIsImxvZ2luX3RhYmxlX3NsdWciOiJ1c2VyIiwicHJvamVjdF9pZCI6IjMwOWE5YzNhLThjYmUtNDc2NC1hNjFmLWNjOTY5OTc0NmI0NCIsInJvbGVfaWQiOiJlZTczMDI1NC1hNmJhLTQzMzAtYWFhNC05MjAxNTQxZjk5MWYiLCJ0YWJsZXMiOm51bGwsInVzZXJfaWQiOiIwNGFhNzFlYy1iNTNjLTQ4ODItOWFlZS04MDcwMTNkODBmMjYiLCJ1c2VyX2lkX2F1dGgiOiIwNGFhNzFlYy1iNTNjLTQ4ODItOWFlZS04MDcwMTNkODBmMjYifQ.VAdPjmHSAqG2Q3eTEAbay9vQKrGA8xihWAtULCMe3Ms"; // Replace with your actual token

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          "https://api.admin.u-code.io/v2/items/notifications",
          {
            headers: {
              Authorization: `Bearer ${bearerToken}`,
            },
          }
        );
        const fetchedNotifications = response.data?.data?.data?.response || [];
        setNotifications(fetchedNotifications);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };

    const checkAuthentication = () => {
      const user = localStorage.getItem("user");
      const phone = localStorage.getItem("phone");
      if (user && phone) {
        const parsedUser = JSON.parse(user);
        setIsAuthenticatedState(true);
        setUserDataState(parsedUser);
      }
    };

    fetchNotifications();
    checkAuthentication();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("phone");
    setIsAuthenticatedState(false);
    setUserDataState(null);
    setIsAuthenticated(false);
    setUserData(null);
  };

  const handleLoginClick = () => {
    setShowLogin(true);
  };

  // Get phone number from local storage
  const phoneNumber = localStorage.getItem("phone");

  return (
    <div className="navbar">
      <Link to="/">
        <img className="logo" src="./assets/logo.png" alt="logo" />
      </Link>
      <ul className="navbar-menu">
        <Link to="/" onClick={() => setMenu("home")} className={menu === "home" ? "active" : ""}>
          Home
        </Link>
        <a href="#explore-menu" onClick={() => setMenu("menu")} className={menu === "menu" ? "active" : ""}>
          Menu
        </a>
        <a href="#app-download" onClick={() => setMenu("mobile-app")} className={menu === "mobile-app" ? "active" : ""}>
          Mobile app
        </a>
        <a href="#footer" onClick={() => setMenu("contact-us")} className={menu === "contact-us" ? "active" : ""}>
          Contact us
        </a>
      </ul>
      <div className="navbar-right">
        <div className="navbar-search-icon">
          <Link to="/cart">
            <img src="./assets/korzina.png" style={{ width: "20px", height: "20px" }} alt="cart" />
          </Link>
          <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
        </div>
        <div className="navbar-notifications" onClick={() => setShowNotifications((prev) => !prev)}>
          <img src="./assets/not.png" alt="notifications" style={{ width: "24px", cursor: "pointer" }} />
          {notifications.length > 0 && <div className="dot"></div>}
        </div>
        {showNotifications && (
          <div className="notifications-dropdown">
            {notifications.length > 0 ? (
              notifications.map((notification, index) => (
                <div key={index} className="notification-item">
                  <img
                    src={notification.img}
                    alt="notification"
                    style={{ width: "50px", height: "50px", marginRight: "10px" }}
                  />
                  <div>
                    <h4>{notification.tittle}</h4>
                    <p>{notification.descripton}</p>
                    <span>{new Date(notification.date).toLocaleString()}</span>
                  </div>
                </div>
              ))
            ) : (
              <p>No notifications</p>
            )}
          </div>
        )}

        {/* Show Profile if authenticated, otherwise Show 'Sign In' */}
        {isAuthenticatedState ? (
          <div className="profile">
            <img
              src={userDataState?.profilePicture || "./assets/default-avatar.png"}
              alt="Profile"
              style={{ width: "30px", height: "30px", borderRadius: "50%" }}
            />
            <span>{phoneNumber || "User"}</span>
            <button onClick={handleLogout} style={{ marginLeft: "10px" }}>Logout</button>
          </div>
        ) : (
          <button onClick={handleLoginClick}>Sign in</button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
