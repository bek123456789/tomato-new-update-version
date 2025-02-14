import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // React Router for navigation
import axios from "axios";
import "./OrderHistory.css"; // Importing CSS file

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(""); // State for error handling
    const navigate = useNavigate(); // Hook for page navigation

    const bearerToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRfcGxhdGZvcm1faWQiOiIiLCJjbGllbnRfdHlwZV9pZCI6ImYzODMyMzdiLTJmM2YtNDkyMC1iMDcwLWM4M2E4ZjM3YTZlNyIsImRhdGEiOiJNb3ppbGxhLzUuMCAoV2luZG93cyBOVCAxMC4wOyBXaW42NDsgeDY0KSBBcHBsZVdlYktpdC81MzcuMzYgKEtIVE1MLCBsaWtlIEdlY2tvKSBDaHJvbWUvMTMxLjAuMC4wIFNhZmFyaS81MzcuMzYiLCJleHAiOjE3Mzk2MzI1NjgsImlhdCI6MTczOTU0NjE2OCwiaWQiOiJhOThkZTMwMy00OTNmLTQ0MjYtOGU0OC0yY2E2YzA1ZjRlMzAiLCJpcCI6Ik1vemlsbGEvNS4wIChXaW5kb3dzIE5UIDEwLjA7IFdpbjY0OyB4NjQpIEFwcGxlV2ViS2l0LzUzNy4zNiAoS0hUTUwsIGxpa2UgR2Vja28pIENocm9tZS8xMzEuMC4wLjAgU2FmYXJpLzUzNy4zNiIsImxvZ2luX3RhYmxlX3NsdWciOiJ1c2VyIiwicHJvamVjdF9pZCI6IjMwOWE5YzNhLThjYmUtNDc2NC1hNjFmLWNjOTY5OTc0NmI0NCIsInJvbGVfaWQiOiJlZTczMDI1NC1hNmJhLTQzMzAtYWFhNC05MjAxNTQxZjk5MWYiLCJ0YWJsZXMiOm51bGwsInVzZXJfaWQiOiIwNGFhNzFlYy1iNTNjLTQ4ODItOWFlZS04MDcwMTNkODBmMjYiLCJ1c2VyX2lkX2F1dGgiOiIwNGFhNzFlYy1iNTNjLTQ4ODItOWFlZS04MDcwMTNkODBmMjYifQ.j9APkzeBXgSPR4LPBIwHLngJPcBEld0900tAiG0wfMs"; // Use environment variable for the token

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(
                    "https://api.admin.u-code.io/v2/items/order_item",
                    {
                        headers: {
                            Authorization: `Bearer ${bearerToken}`,
                        },
                    }
                );

                if (response?.data?.data?.data?.response) {
                    setOrders(response.data.data.data.response);
                } else {
                    setOrders([]); // If no data available, set an empty array
                }
            } catch (error) {
                console.error("Failed to fetch orders:", error);
                setError("There was an issue fetching the orders. Please try again later.");
            }
        };

        fetchOrders();
    }, [bearerToken]); // Re-run when bearerToken changes

    // ❌ button to navigate back to home
    const handleDeleteClick = () => {
        navigate("/"); // Navigate to home page
    };

    return (
        <div className="order-history-container">
            <div className="order-history-card">
                <h1 className="order-history-title">Order History 🛒</h1>
                <button className="delete-button" onClick={handleDeleteClick}>
                    ❌
                </button>

                {error && <p className="error-message">{error}</p>} {/* Show error if any */}

                {orders.length > 0 ? (
                    <div className="order-list">
                        {orders.map((order, index) => (
                            <div key={index} className="order-item">
                                <div className="order-details">
                                    <h2 className="order-name">{order.dish_name}</h2>
                                    <p className="order-quantity">Soni: {order.quantity}</p>
                                </div>
                                <div className="order_status_p_div">
                                    <p className="order-price">Narxi: {order.dish_price} 000 so'm</p>
                                    <p>{order.status}</p>
                                </div>

                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="no-orders">No orders found 😔</p>
                )}
            </div>
        </div>
    );
};

export default OrderHistory;
