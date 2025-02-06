import "./Navbar.css";
import { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";

const Navbar = ({ setShowLogin, isAuthenticated, userData, onLogout }) => {
  const [menu, setMenu] = useState("home");
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const { getTotalCartAmount } = useContext(StoreContext);
  const navigate = useNavigate();

  const bearerToken = "YOUR_BEARER_TOKEN_HERE";

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
        setNotifications(response.data?.data?.data?.response || []);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className="navbar">
      <Link to="/">
        <img className="logo" src="https://marketing.uz/uploads/articles/5437/article-original.png" alt="logo" />
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
                  <img src={notification.img} alt="notification" style={{ width: "50px", height: "50px", marginRight: "10px" }} />
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

        {/* Order History Icon */}
        <div className="navbar-orders" onClick={() => navigate("/order-history")}>
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPxc7JpQd-fUpmNqM2QvIESurEsDKmibOEww&s" style={{ width: "24px", cursor: "pointer" }} alt="orders" />
        </div>

        {/* Profile/Login */}
        <div className="navbar-profile">
          {isAuthenticated ? (
            <div className="profile-info">
              <img
                src={userData?.profilePicture || "./assets/default-avatar.png"}
                alt="user-profile"
                className="profile-avatar"
                style={{ cursor: "pointer" }}
              />
              <div className="profile-dropdown">
                <Link to="/profile">Profile</Link>
                <button onClick={onLogout}>Logout</button>
              </div>
            </div>
          ) : (
            <button className="login-button" onClick={() => setShowLogin(true)}>Login</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
