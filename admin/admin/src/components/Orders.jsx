import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../src/styles.css';

const API_URL = 'https://api.admin.u-code.io/v2/items/order_item';
const PUT_URL = 'https://api.admin.u-code.io/v2/items/order_item';
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRfcGxhdGZvcm1faWQiOiIiLCJjbGllbnRfdHlwZV9pZCI6ImYzODMyMzdiLTJmM2YtNDkyMC1iMDcwLWM4M2E4ZjM3YTZlNyIsImRhdGEiOiJNb3ppbGxhLzUuMCAoV2luZG93cyBOVCAxMC4wOyBXaW42NDsgeDY0KSBBcHBsZVdlYktpdC81MzcuMzYgKEtIVE1MLCBsaWtlIEdlY2tvKSBDaHJvbWUvMTMxLjAuMC4wIFNhZmFyaS81MzcuMzYiLCJleHAiOjE3MzkxNjM4MTQsImlhdCI6MTczOTA3NzQxNCwiaWQiOiJhOThkZTMwMy00OTNmLTQ0MjYtOGU0OC0yY2E2YzA1ZjRlMzAiLCJpcCI6Ik1vemlsbGEvNS4wIChXaW5kb3dzIE5UIDEwLjA7IFdpbjY0OyB4NjQpIEFwcGxlV2ViS2l0LzUzNy4zNiAoS0hUTUwsIGxpa2UgR2Vja28pIENocm9tZS8xMzEuMC4wLjAgU2FmYXJpLzUzNy4zNiIsImxvZ2luX3RhYmxlX3NsdWciOiJ1c2VyIiwicHJvamVjdF9pZCI6IjMwOWE5YzNhLThjYmUtNDc2NC1hNjFmLWNjOTY5OTc0NmI0NCIsInJvbGVfaWQiOiJlZTczMDI1NC1hNmJhLTQzMzAtYWFhNC05MjAxNTQxZjk5MWYiLCJ0YWJsZXMiOm51bGwsInVzZXJfaWQiOiIwNGFhNzFlYy1iNTNjLTQ4ODItOWFlZS04MDcwMTNkODBmMjYiLCJ1c2VyX2lkX2F1dGgiOiIwNGFhNzFlYy1iNTNjLTQ4ODItOWFlZS04MDcwMTNkODBmMjYifQ.nJdONRlAM6xUbJL1EE_RD6hIkdnyYuPtgOCGCoXQZFc';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get(API_URL, {
      headers: { Authorization: `Bearer ${TOKEN}` },
    })
      .then((response) => {
        setOrders(response.data.data.data.response);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleStatusChange = (orderId, status, guid) => {
    axios.put(PUT_URL,
      { data: { status: status, guid: guid } },
      {
        headers: { Authorization: `Bearer ${TOKEN}` },
      }
    )
      .then((response) => {
        x
        setMessage('Status muvaffaqiyatli yangilandi!');

        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.order_id === orderId ? { ...order, status: status } : order
          )
        );
      })
      .catch((err) => {
        setMessage('Status yangilanishida xatolik yuz berdi!');
      });
  };

  if (loading) return <p>Yuklanmoqda...</p>;
  if (error) return <p>Xato: {error}</p>;

  return (
    <div className="orders-container">
      <h2>Buyurtmalar</h2>

      {message && <p className="message">{message}</p>}

      <table>
        <thead>
          <tr>
            <th>Taom Nomi</th>
            <th>Taom Narxi</th>
            <th>Soni</th>
            <th>GUID</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.order_id}>
              <td>{order.dish_name}</td>
              <td>{order.dish_price} 000 so'm</td>
              <td>{order.quantity} ta </td>
              <td>{order.guid}</td>
              <td>
                <select
                  value={order.status || ''}
                  onChange={(e) =>
                    handleStatusChange(order.order_id, e.target.value, order.guid)
                  }
                >
                  <option value="">-- Statusni tanlang --</option>
                  <option value="Zakaz Qabul Qilingan">Zakaz Qabul Qilingan</option>
                  <option value="Zakaz Tayyorlanmoqda">Zakaz Tayyorlanmoqda</option>
                  <option value="Zakaz Kuryerga Berildi">Zakaz Kuryerga Berildi</option>
                  <option value="Zakaz Yetkazib Berildi">Zakaz Yetkazib Berildi</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Orders;
