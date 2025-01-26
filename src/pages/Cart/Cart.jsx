import React, { useState, useEffect, useContext } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Cart = () => {
  const { cartItems, removeFromCart, getTotalCartAmount } = useContext(StoreContext);
  const [foodList, setFoodList] = useState([]);
  const navigate = useNavigate();

  // Save cart to localStorage
  useEffect(() => {
    const detailedCartItems = Object.keys(cartItems)
      .map((itemId) => {
        const item = foodList.find((foodItem) => foodItem._id === itemId);
        if (item) {
          return {
            dish_name: item.name,
            dish_price: item.price,
            quantity: cartItems[itemId],
          };
        }
        return null;
      })
      .filter((item) => item !== null);

    localStorage.setItem("cartItems", JSON.stringify(detailedCartItems));
  }, [cartItems, foodList]);

  // Fetch food list from the API
  useEffect(() => {
    const fetchFoodList = async () => {
      try {
        const response = await axios.get("https://api.admin.u-code.io/v2/items/dish", {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRfcGxhdGZvcm1faWQiOiIiLCJjbGllbnRfdHlwZV9pZCI6ImYzODMyMzdiLTJmM2YtNDkyMC1iMDcwLWM4M2E4ZjM3YTZlNyIsImRhdGEiOiJNb3ppbGxhLzUuMCAoV2luZG93cyBOVCAxMC4wOyBXaW42NDsgeDY0KSBBcHBsZVdlYktpdC81MzcuMzYgKEtIVE1MLCBsaWtlIEdlY2tvKSBDaHJvbWUvMTMxLjAuMC4wIFNhZmFyaS81MzcuMzYiLCJleHAiOjE3Mzc5NjI3OTQsImlhdCI6MTczNzg3NjM5NCwiaWQiOiIxZDI5MmM5Yi05YWYyLTQ5MzYtOWVlZi01NzI5OTZiMjc3NmEiLCJpcCI6Ik1vemlsbGEvNS4wIChXaW5kb3dzIE5UIDEwLjA7IFdpbjY0OyB4NjQpIEFwcGxlV2ViS2l0LzUzNy4zNiAoS0hUTUwsIGxpa2UgR2Vja28pIENocm9tZS8xMzEuMC4wLjAgU2FmYXJpLzUzNy4zNiIsImxvZ2luX3RhYmxlX3NsdWciOiJ1c2VyIiwicHJvamVjdF9pZCI6IjMwOWE5YzNhLThjYmUtNDc2NC1hNjFmLWNjOTY5OTc0NmI0NCIsInJvbGVfaWQiOiJlZTczMDI1NC1hNmJhLTQzMzAtYWFhNC05MjAxNTQxZjk5MWYiLCJ0YWJsZXMiOm51bGwsInVzZXJfaWQiOiIwNGFhNzFlYy1iNTNjLTQ4ODItOWFlZS04MDcwMTNkODBmMjYiLCJ1c2VyX2lkX2F1dGgiOiIwNGFhNzFlYy1iNTNjLTQ4ODItOWFlZS04MDcwMTNkODBmMjYifQ.gaNLqcIjT98Dh2sTSeuyeDc4l27u_alKLD0rEq2IwCs`,
          },
        });

        const fetchedFoodList = response.data.data.data.response.map((item) => ({
          _id: item.guid,
          name: item.dish_name,
          price: parseFloat(item.Cost.replace("$", "")),
          image: item.Img_URL,
          description: item.Description_dish,
        }));

        setFoodList(fetchedFoodList);
      } catch (error) {
        console.error("Error fetching food list", error);
      }
    };

    fetchFoodList();
  }, []);

  // Checkout function to submit each order separately
  const handleCheckout = async () => {
    const orderData = Object.keys(cartItems)
      .map((itemId) => {
        const item = foodList.find((foodItem) => foodItem._id === itemId);
        if (item && cartItems[itemId] > 0) {
          return {
            dish_name: item.name,
            dish_price: item.price.toString(),
            quantity: cartItems[itemId].toString(),
          };
        }
        return null;
      })
      .filter((item) => item !== null);

    if (orderData.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    try {
      // Submit each order as a separate POST request
      await Promise.all(
        orderData.map((order) =>
          axios.post(
            "https://api.admin.u-code.io/v2/items/order_item",
            { data: order },
            {
              headers: {
                Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRfcGxhdGZvcm1faWQiOiIiLCJjbGllbnRfdHlwZV9pZCI6ImYzODMyMzdiLTJmM2YtNDkyMC1iMDcwLWM4M2E4ZjM3YTZlNyIsImRhdGEiOiJNb3ppbGxhLzUuMCAoV2luZG93cyBOVCAxMC4wOyBXaW42NDsgeDY0KSBBcHBsZVdlYktpdC81MzcuMzYgKEtIVE1MLCBsaWtlIEdlY2tvKSBDaHJvbWUvMTMxLjAuMC4wIFNhZmFyaS81MzcuMzYiLCJleHAiOjE3Mzc5NjI3OTQsImlhdCI6MTczNzg3NjM5NCwiaWQiOiIxZDI5MmM5Yi05YWYyLTQ5MzYtOWVlZi01NzI5OTZiMjc3NmEiLCJpcCI6Ik1vemlsbGEvNS4wIChXaW5kb3dzIE5UIDEwLjA7IFdpbjY0OyB4NjQpIEFwcGxlV2ViS2l0LzUzNy4zNiAoS0hUTUwsIGxpa2UgR2Vja28pIENocm9tZS8xMzEuMC4wLjAgU2FmYXJpLzUzNy4zNiIsImxvZ2luX3RhYmxlX3NsdWciOiJ1c2VyIiwicHJvamVjdF9pZCI6IjMwOWE5YzNhLThjYmUtNDc2NC1hNjFmLWNjOTY5OTc0NmI0NCIsInJvbGVfaWQiOiJlZTczMDI1NC1hNmJhLTQzMzAtYWFhNC05MjAxNTQxZjk5MWYiLCJ0YWJsZXMiOm51bGwsInVzZXJfaWQiOiIwNGFhNzFlYy1iNTNjLTQ4ODItOWFlZS04MDcwMTNkODBmMjYiLCJ1c2VyX2lkX2F1dGgiOiIwNGFhNzFlYy1iNTNjLTQ4ODItOWFlZS04MDcwMTNkODBmMjYifQ.gaNLqcIjT98Dh2sTSeuyeDc4l27u_alKLD0rEq2IwCs`,
                "Content-Type": "application/json",
              },
            }
          )
        )
      );

      console.log("All orders submitted successfully!");
      navigate("/order");
    } catch (error) {
      console.error("Error submitting orders:", error);
      alert("An error occurred while submitting your orders. Please try again.");
    }
  };

  return (
    <div className="cart">
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />
        {foodList.map((item) => {
          if (cartItems[item._id] > 0) {
            return (
              <div key={item._id}>
                <div className="cart-items-title cart-items-item">
                  <img src={item.image} alt={item.name} />
                  <p>{item.name}</p>
                  <p>${item.price}</p>
                  <p>{cartItems[item._id]}</p>
                  <p>${item.price * cartItems[item._id]}</p>
                  <p onClick={() => removeFromCart(item._id)} className="cross">
                    x
                  </p>
                </div>
                <hr />
              </div>
            );
          }
        })}
      </div>
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Total</h2>
          <div className="cart-total-details">
            <p>Subtotal</p>
            <p>${getTotalCartAmount()}</p>
          </div>
          <hr />
          <div className="cart-total-details">
            <p>Delivery Fee</p>
            <p>${getTotalCartAmount() === 0 ? 0 : 2}</p>
          </div>
          <hr />
          <div className="cart-total-details">
            <b>Total</b>
            <b>${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}</b>
          </div>
          <button onClick={handleCheckout}>PROCEED TO CHECKOUT</button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
