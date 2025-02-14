import React, { useState, useEffect } from "react";
import "./ExploreMenu.css";

const ExploreMenu = ({ category, setCategory }) => {
  const [menuList, setMenuList] = useState([]);
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRfcGxhdGZvcm1faWQiOiIiLCJjbGllbnRfdHlwZV9pZCI6ImYzODMyMzdiLTJmM2YtNDkyMC1iMDcwLWM4M2E4ZjM3YTZlNyIsImRhdGEiOiJNb3ppbGxhLzUuMCAoV2luZG93cyBOVCAxMC4wOyBXaW42NDsgeDY0KSBBcHBsZVdlYktpdC81MzcuMzYgKEtIVE1MLCBsaWtlIEdlY2tvKSBDaHJvbWUvMTMxLjAuMC4wIFNhZmFyaS81MzcuMzYiLCJleHAiOjE3Mzk2MzI1NjgsImlhdCI6MTczOTU0NjE2OCwiaWQiOiJhOThkZTMwMy00OTNmLTQ0MjYtOGU0OC0yY2E2YzA1ZjRlMzAiLCJpcCI6Ik1vemlsbGEvNS4wIChXaW5kb3dzIE5UIDEwLjA7IFdpbjY0OyB4NjQpIEFwcGxlV2ViS2l0LzUzNy4zNiAoS0hUTUwsIGxpa2UgR2Vja28pIENocm9tZS8xMzEuMC4wLjAgU2FmYXJpLzUzNy4zNiIsImxvZ2luX3RhYmxlX3NsdWciOiJ1c2VyIiwicHJvamVjdF9pZCI6IjMwOWE5YzNhLThjYmUtNDc2NC1hNjFmLWNjOTY5OTc0NmI0NCIsInJvbGVfaWQiOiJlZTczMDI1NC1hNmJhLTQzMzAtYWFhNC05MjAxNTQxZjk5MWYiLCJ0YWJsZXMiOm51bGwsInVzZXJfaWQiOiIwNGFhNzFlYy1iNTNjLTQ4ODItOWFlZS04MDcwMTNkODBmMjYiLCJ1c2VyX2lkX2F1dGgiOiIwNGFhNzFlYy1iNTNjLTQ4ODItOWFlZS04MDcwMTNkODBmMjYifQ.j9APkzeBXgSPR4LPBIwHLngJPcBEld0900tAiG0wfMs";

  useEffect(() => {
    fetch("https://api.admin.u-code.io/v2/items/menu", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const formattedMenu = data.data.data.response.map((item) => ({
          menu_name: item.menu_name,
        }));
        setMenuList(formattedMenu);
      })
      .catch((error) => {
        console.error("Menu malumotlarini olishda xatolik:", error);
      });
  }, [token]); // Agar token o'zgarishi mumkin bo'lsa, uni bog'lash kerak

  return (
    <div className="explore-menu" id="explore-menu">
      <h1>Menuni Ko'rib Chiqing</h1>
      <p className="explore-menu-text">
        Turli xil taomlar bilan to'ldirilgan menyudan tanlang. Bizning maqsadimiz
        ishtahangizni qondirish va tajribangizni yanada a'lo darajaga ko'tarish.
      </p>
      <div className="explore-menu-list">
        {menuList.map((item, index) => {
          return (
            <div key={index} className="explore-menu-list-item">
              <button
                onClick={() =>
                  setCategory((prev) =>
                    prev === item.menu_name ? "Barchasi" : item.menu_name
                  )
                }
                className={category === item.menu_name ? "active" : ""}
              >
                {item.menu_name}
              </button>
            </div>
          );
        })}
      </div>
      <hr />
    </div>
  );
};

export default ExploreMenu;
