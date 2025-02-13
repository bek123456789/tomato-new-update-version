import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import "./Cart.css";

const Cart = () => {
  const { cartItems, removeFromCart, getTotalCartAmount } = useContext(StoreContext);
  const [foodList, setFoodList] = useState([]);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    street: "",
    city: "",
    country: "",
    phone: "",
  });
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    cvv: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch food list from API
  useEffect(() => {
    const fetchFoodList = async () => {
      try {
        const response = await axios.get("https://api.admin.u-code.io/v2/items/dish", {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRfcGxhdGZvcm1faWQiOiIiLCJjbGllbnRfdHlwZV9pZCI6ImYzODMyMzdiLTJmM2YtNDkyMC1iMDcwLWM4M2E4ZjM3YTZlNyIsImRhdGEiOiJNb3ppbGxhLzUuMCAoV2luZG93cyBOVCAxMC4wOyBXaW42NDsgeDY0KSBBcHBsZVdlYktpdC81MzcuMzYgKEtIVE1MLCBsaWtlIEdlY2tvKSBDaHJvbWUvMTMxLjAuMC4wIFNhZmFyaS81MzcuMzYiLCJleHAiOjE3Mzk0Njk1MjksImlhdCI6MTczOTM4MzEyOSwiaWQiOiJhOThkZTMwMy00OTNmLTQ0MjYtOGU0OC0yY2E2YzA1ZjRlMzAiLCJpcCI6Ik1vemlsbGEvNS4wIChXaW5kb3dzIE5UIDEwLjA7IFdpbjY0OyB4NjQpIEFwcGxlV2ViS2l0LzUzNy4zNiAoS0hUTUwsIGxpa2UgR2Vja28pIENocm9tZS8xMzEuMC4wLjAgU2FmYXJpLzUzNy4zNiIsImxvZ2luX3RhYmxlX3NsdWciOiJ1c2VyIiwicHJvamVjdF9pZCI6IjMwOWE5YzNhLThjYmUtNDc2NC1hNjFmLWNjOTY5OTc0NmI0NCIsInJvbGVfaWQiOiJlZTczMDI1NC1hNmJhLTQzMzAtYWFhNC05MjAxNTQxZjk5MWYiLCJ0YWJsZXMiOm51bGwsInVzZXJfaWQiOiIwNGFhNzFlYy1iNTNjLTQ4ODItOWFlZS04MDcwMTNkODBmMjYiLCJ1c2VyX2lkX2F1dGgiOiIwNGFhNzFlYy1iNTNjLTQ4ODItOWFlZS04MDcwMTNkODBmMjYifQ.3ZzUuoRSsUYQdz9b0zph_jaQMKscf5lpKaDSkfMh7r4`,
          },
        });

        const fetchedFoodList = response.data.data.data.response.map((item) => ({
          _id: item.guid,
          name: item.dish_name,
          price: parseFloat(item.Cost),
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

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const formatCardNumber = (number) =>
    number.replace(/\D/g, "").replace(/(\d{4})(?=\d)/g, "$1 ");
  const validateCardNumber = (number) =>
    /^\d{16}$/.test(number.replace(/\s/g, ""));
  const validateCVV = (cvv) => /^\d{3,4}$/.test(cvv);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentData((prevState) => ({
      ...prevState,
      [name]: name === "cardNumber" ? formatCardNumber(value) : value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    Object.keys(formData).forEach((key) => {
      if (!formData[key]) {
        newErrors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} is required.`;
      }
    });

    if (formData.email && !validateEmail(formData.email)) {
      newErrors.email = "Invalid email address.";
    }

    if (!validateCardNumber(paymentData.cardNumber)) {
      newErrors.cardNumber = "Card number must be 16 digits.";
    }
    if (!validateCVV(paymentData.cvv)) {
      newErrors.cvv = "CVV must be 3 or 4 digits.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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

    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRfcGxhdGZvcm1faWQiOiIiLCJjbGllbnRfdHlwZV9pZCI6ImYzODMyMzdiLTJmM2YtNDkyMC1iMDcwLWM4M2E4ZjM3YTZlNyIsImRhdGEiOiJNb3ppbGxhLzUuMCAoV2luZG93cyBOVCAxMC4wOyBXaW42NDsgeDY0KSBBcHBsZVdlYktpdC81MzcuMzYgKEtIVE1MLCBsaWtlIEdlY2tvKSBDaHJvbWUvMTMxLjAuMC4wIFNhZmFyaS81MzcuMzYiLCJleHAiOjE3Mzk0Njk1MjksImlhdCI6MTczOTM4MzEyOSwiaWQiOiJhOThkZTMwMy00OTNmLTQ0MjYtOGU0OC0yY2E2YzA1ZjRlMzAiLCJpcCI6Ik1vemlsbGEvNS4wIChXaW5kb3dzIE5UIDEwLjA7IFdpbjY0OyB4NjQpIEFwcGxlV2ViS2l0LzUzNy4zNiAoS0hUTUwsIGxpa2UgR2Vja28pIENocm9tZS8xMzEuMC4wLjAgU2FmYXJpLzUzNy4zNiIsImxvZ2luX3RhYmxlX3NsdWciOiJ1c2VyIiwicHJvamVjdF9pZCI6IjMwOWE5YzNhLThjYmUtNDc2NC1hNjFmLWNjOTY5OTc0NmI0NCIsInJvbGVfaWQiOiJlZTczMDI1NC1hNmJhLTQzMzAtYWFhNC05MjAxNTQxZjk5MWYiLCJ0YWJsZXMiOm51bGwsInVzZXJfaWQiOiIwNGFhNzFlYy1iNTNjLTQ4ODItOWFlZS04MDcwMTNkODBmMjYiLCJ1c2VyX2lkX2F1dGgiOiIwNGFhNzFlYy1iNTNjLTQ4ODItOWFlZS04MDcwMTNkODBmMjYifQ.3ZzUuoRSsUYQdz9b0zph_jaQMKscf5lpKaDSkfMh7r4";
    const totalAmount = getTotalCartAmount() + 4;

    try {
      // Submit delivery information
      const deliveryResponse = await fetch(
        "https://api.admin.u-code.io/v2/items/delivery_infom",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            data: formData,
          }),
        }
      );

      if (!deliveryResponse.ok) {
        throw new Error("Failed to submit delivery information.");
      }

      // Submit order
      const orderResponse = await fetch(
        "https://api.admin.u-code.io/v2/items/order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            data: {
              customer_name: `${formData.first_name} ${formData.last_name}`,
              order_date: new Date().toISOString(),
              total_amount: totalAmount,
            },
          }),
        }
      );

      if (!orderResponse.ok) {
        throw new Error("Failed to submit order.");
      }

      const orderResult = await orderResponse.json();
      const orderId = orderResult.data.id;


      for (const item of orderData) {
        const orderItemResponse = await fetch(
          "https://api.admin.u-code.io/v2/items/order_item",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              data: {
                order_id: orderId,
                dish_name: item.dish_name,
                dish_price: item.dish_price,
                quantity: item.quantity,
              },
            }),
          }
        );

        if (!orderItemResponse.ok) {
          throw new Error("Failed to submit order item.");
        }
      }

      // Submit payment
      const paymentResponse = await fetch(
        "https://api.admin.u-code.io/v2/items/payment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            data: {
              cardNumber: paymentData.cardNumber.replace(/\s/g, ""),
              cvv: paymentData.cvv,
              amount: totalAmount,
            },
          }),
        }
      );

      if (!paymentResponse.ok) {
        throw new Error("Failed to process payment.");
      }

      navigate("/");
    } catch (error) {
      console.error("An error occurred:", error);
      alert("Failed to place order. Please try again.");
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
                  <p>{item.price}000 so'm</p>
                  <p>{cartItems[item._id]}</p>
                  <p>{item.price * cartItems[item._id]}000 so'm</p>
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

      <div className="place-order">
        <div className="place-order-left">
          <p className="title">Delivery Information</p>
          <div className="multi-fields">
            <input
              type="text"
              name="first_name"
              placeholder="First Name"
              value={formData.first_name}
              onChange={handleChange}
              required
            />
            {errors.first_name && <p className="error">{errors.first_name}</p>}
            <input
              type="text"
              name="last_name"
              placeholder="Last Name"
              value={formData.last_name}
              onChange={handleChange}
              required
            />
            {errors.last_name && <p className="error">{errors.last_name}</p>}
          </div>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && <p className="error">{errors.email}</p>}

          <div className="multi-fields">
            <input
              type="text"
              name="street"
              placeholder="Street"
              value={formData.street}
              onChange={handleChange}
              required
            />
            {errors.street && <p className="error">{errors.street}</p>}
            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
              required
            />
            {errors.city && <p className="error">{errors.city}</p>}
          </div>

          <input
            type="text"
            name="country"
            placeholder="Country"
            value={formData.country}
            onChange={handleChange}
            required
          />
          {errors.country && <p className="error">{errors.country}</p>}

          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          {errors.phone && <p className="error">{errors.phone}</p>}

          <p className="title">Payment Information</p>
          <input
            type="text"
            name="cardNumber"
            placeholder="Card Number"
            value={paymentData.cardNumber}
            onChange={handlePaymentChange}
            required
          />
          {errors.cardNumber && <p className="error">{errors.cardNumber}</p>}

          <input
            type="text"
            name="cvv"
            placeholder="CVV"
            value={paymentData.cvv}
            onChange={handlePaymentChange}
            required
          />
          {errors.cvv && <p className="error">{errors.cvv}</p>}

          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={getTotalCartAmount() + 4}
            disabled
          />
        </div>

        <div className="place-order-right">
          <div className="cart-total">
            <h2>Cart Total</h2>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>{getTotalCartAmount()}000 so'm</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>{getTotalCartAmount() === 0 ? 0 : 4}000 so'm</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 4}000 so'm</b>
            </div>
            <button onClick={handleCheckout} disabled={loading}>
              {loading ? "Processing..." : "PROCEED TO PAYMENT"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
