import React, { useState, useEffect, useContext } from "react";
import "./FoodItem.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";

const FoodItem = ({ id }) => {
  const { cartItems, addToCart, removeFromCart } = useContext(StoreContext);
  const [foodData, setFoodData] = useState(null);

  useEffect(() => {
    const fetchFoodItem = async () => {
      try {
        const response = await axios.get(`https://api.admin.u-code.io/v2/items/dish/${id}`, {
          headers: {
            Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRfcGxhdGZvcm1faWQiOiIiLCJjbGllbnRfdHlwZV9pZCI6ImYzODMyMzdiLTJmM2YtNDkyMC1iMDcwLWM4M2E4ZjM3YTZlNyIsImRhdGEiOiJNb3ppbGxhLzUuMCAoV2luZG93cyBOVCAxMC4wOyBXaW42NDsgeDY0KSBBcHBsZVdlYktpdC81MzcuMzYgKEtIVE1MLCBsaWtlIEdlY2tvKSBDaHJvbWUvMTMxLjAuMC4wIFNhZmFyaS81MzcuMzYiLCJleHAiOjE3MzgxMjk5MDQsImlhdCI6MTczODA0MzUwNCwiaWQiOiJhOThkZTMwMy00OTNmLTQ0MjYtOGU0OC0yY2E2YzA1ZjRlMzAiLCJpcCI6Ik1vemlsbGEvNS4wIChXaW5kb3dzIE5UIDEwLjA7IFdpbjY0OyB4NjQpIEFwcGxlV2ViS2l0LzUzNy4zNiAoS0hUTUwsIGxpa2UgR2Vja28pIENocm9tZS8xMzEuMC4wLjAgU2FmYXJpLzUzNy4zNiIsImxvZ2luX3RhYmxlX3NsdWciOiJ1c2VyIiwicHJvamVjdF9pZCI6IjMwOWE5YzNhLThjYmUtNDc2NC1hNjFmLWNjOTY5OTc0NmI0NCIsInJvbGVfaWQiOiJlZTczMDI1NC1hNmJhLTQzMzAtYWFhNC05MjAxNTQxZjk5MWYiLCJ0YWJsZXMiOm51bGwsInVzZXJfaWQiOiIwNGFhNzFlYy1iNTNjLTQ4ODItOWFlZS04MDcwMTNkODBmMjYiLCJ1c2VyX2lkX2F1dGgiOiIwNGFhNzFlYy1iNTNjLTQ4ODItOWFlZS04MDcwMTNkODBmMjYifQ.o_TxKgj8tHEHyTajOB3lrpfvDy1oaFd0_BiisXl24Xw",
          },
        });
        const data = response.data.data.data.response;
        setFoodData({
          _id: data.guid,
          name: data.dish_name,
          price: parseFloat(data.Cost.replace('$', '')),
          description: data.Description_dish,
          image: data.Img_URL,
        });
      } catch (error) {
        console.error("Error fetching food item", error);
      }
    };

    fetchFoodItem();
  }, [id]);

  if (!foodData) return <p>Loading...</p>;

  return (
    <div className="food-item">
      <div className="food-item-img-container">
        <img className="food-item-image" src={foodData.image} alt={foodData.name} />
        {!cartItems[foodData._id] ? (
          <img
            className="add"
            onClick={() => addToCart(foodData._id)}
            src="./public/assets/add_icon_white.png"
            alt="add icon"
          />
        ) : (
          <div className="food-item-counter">
            <img
              onClick={() => removeFromCart(foodData._id)}
              src="./public/assets/remove_icon_red.png" // Corrected icon path
              alt="remove icon"
            />
            <p>{cartItems[foodData._id]}</p>
            <img
              onClick={() => addToCart(foodData._id)}
              src="./public/assets/add_icon_green.png" // Corrected icon path
              alt="add icon"
            />
          </div>
        )}
      </div>
      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{foodData.name}</p>
          <img src="./public/assets/rating_starts.png" alt="rating" /> {/* Corrected icon path */}
        </div>
        <p className="food-item-description">{foodData.description}</p>
        <p className="food-item-price">${foodData.price}</p>
      </div>
    </div>
  );
};

export default FoodItem;
