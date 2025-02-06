import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>Admin Panel</h2>
      <ul>
        <li><Link to="/admin">Dashboard</Link></li>
        <li><Link to="/orders">Orders</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;
