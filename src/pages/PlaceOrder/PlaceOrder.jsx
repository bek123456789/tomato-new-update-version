import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";

const PlaceOrder = () => {
  const { getTotalCartAmount, getCartItems } = useContext(StoreContext);
  const navigate = useNavigate(); // Initialize navigate

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    street: "",
    city: "",
    country: "",
    phone: ""
  });

  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    cvv: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRfcGxhdGZvcm1faWQiOiIiLCJjbGllbnRfdHlwZV9pZCI6ImYzODMyMzdiLTJmM2YtNDkyMC1iMDcwLWM4M2E4ZjM3YTZlNyIsImRhdGEiOiJNb3ppbGxhLzUuMCAoV2luZG93cyBOVCAxMC4wOyBXaW42NDsgeDY0KSBBcHBsZVdlYktpdC81MzcuMzYgKEtIVE1MLCBsaWtlIEdlY2tvKSBDaHJvbWUvMTMxLjAuMC4wIFNhZmFyaS81MzcuMzYiLCJleHAiOjE3Mzc0NzY1NzYsImlhdCI6MTczNzM5MDE3NiwiaWQiOiJhOThkZTMwMy00OTNmLTQ0MjYtOGU0OC0yY2E2YzA1ZjRlMzAiLCJpcCI6Ik1vemlsbGEvNS4wIChXaW5kb3dzIE5UIDEwLjA7IFdpbjY0OyB4NjQpIEFwcGxlV2ViS2l0LzUzNy4zNiAoS0hUTUwsIGxpa2UgR2Vja28pIENocm9tZS8xMzEuMC4wLjAgU2FmYXJpLzUzNy4zNiIsImxvZ2luX3RhYmxlX3NsdWciOiJ1c2VyIiwicHJvamVjdF9pZCI6IjMwOWE5YzNhLThjYmUtNDc2NC1hNjFmLWNjOTY5OTc0NmI0NCIsInJvbGVfaWQiOiJlZTczMDI1NC1hNmJhLTQzMzAtYWFhNC05MjAxNTQxZjk5MWYiLCJ0YWJsZXMiOm51bGwsInVzZXJfaWQiOiIwNGFhNzFlYy1iNTNjLTQ4ODItOWFlZS04MDcwMTNkODBmMjYiLCJ1c2VyX2lkX2F1dGgiOiIwNGFhNzFlYy1iNTNjLTQ4ODItOWFlZS04MDcwMTNkODBmMjYifQ.Qtty8ax18YCjtJlIAaN5YnxAdyuDMSrnU3g5jyNzi5U";
    const totalAmount = getTotalCartAmount() + 4;

    try {
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

      navigate("/react-food-delivery-website/"); // Navigate to the home page after successful order

    } catch (error) {
      console.error("An error occurred:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="place-order" onSubmit={handleSubmit}>
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input
            type="text"
            name="first_name"
            placeholder="First Name"
            value={formData.first_name}
            onChange={handleChange}
          />
          {errors.first_name && <p className="error">{errors.first_name}</p>}
          <input
            type="text"
            name="last_name"
            placeholder="Last Name"
            value={formData.last_name}
            onChange={handleChange}
          />
          {errors.last_name && <p className="error">{errors.last_name}</p>}
        </div>

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <p className="error">{errors.email}</p>}

        <div className="multi-fields">
          <input
            type="text"
            name="street"
            placeholder="Street"
            value={formData.street}
            onChange={handleChange}
          />
          {errors.street && <p className="error">{errors.street}</p>}
          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
          />
          {errors.city && <p className="error">{errors.city}</p>}
        </div>

        <input
          type="text"
          name="country"
          placeholder="Country"
          value={formData.country}
          onChange={handleChange}
        />
        {errors.country && <p className="error">{errors.country}</p>}

        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
        />
        {errors.phone && <p className="error">{errors.phone}</p>}

        <p className="title">Payment Information</p>
        <input
          type="text"
          name="cardNumber"
          placeholder="Card Number"
          value={paymentData.cardNumber}
          onChange={handlePaymentChange}
        />
        {errors.cardNumber && <p className="error">{errors.cardNumber}</p>}

        <input
          type="text"
          name="cvv"
          placeholder="CVV"
          value={paymentData.cvv}
          onChange={handlePaymentChange}
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
            <p>${getTotalCartAmount()}</p>
          </div>
          <hr />
          <div className="cart-total-details">
            <p>Delivery Fee</p>
            <p>${getTotalCartAmount() === 0 ? 0 : 4}</p>
          </div>
          <hr />
          <div className="cart-total-details">
            <b>Total</b>
            <b>${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 4}</b>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Processing..." : "PROCEED TO PAYMENT"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
