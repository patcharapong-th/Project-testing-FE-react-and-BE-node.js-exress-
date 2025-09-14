import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import UsersList from "./components/UsersList";
import ProductsList from "./components/ProductsList";
import OrdersList from "./components/OrdersList";
import "./css/DashboardLayout.css";

function App() {
  return (
    <Router>
      <div className="app-container">
        <header>
          <h1>Admin Dashboard</h1>
          <nav>
            <Link to="/users">Users</Link>
            <Link to="/products">Products</Link>
            <Link to="/orders">Orders</Link>
          </nav>
        </header>

        <main>
          <Routes>
            <Route path="/users" element={<UsersList />} />
            <Route path="/products" element={<ProductsList />} />
            <Route path="/orders" element={<OrdersList />} />
            <Route path="/" element={<p>Welcome to Admin Dashboard</p>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
