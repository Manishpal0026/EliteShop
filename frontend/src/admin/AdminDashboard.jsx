import React, {
  useContext
} from "react";

import {
  useNavigate
} from "react-router-dom";

import {
  AuthContext
} from "../context/AuthContext";


const AdminDashboard = () => {

  const {
    user,
    logout
  } = useContext(AuthContext);

  const navigate = useNavigate();


  // ==========================================
  // CHECK ADMIN
  // ==========================================

  if (!user) {

    navigate("/admin/login");

    return null;
  }


  if (user.role !== "admin") {

    navigate("/");

    return null;
  }


  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {

    logout();

    navigate("/admin/login");

  };


  return (

    <div
      style={{
        minHeight: "80vh",
        background: "#09090b",
        color: "#fff",
        padding: "30px"
      }}
    >

      {/* Header */}

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto"
        }}
      >

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "30px",
            flexWrap: "wrap",
            gap: "15px"
          }}
        >

          <div>

            <h1
              style={{
                margin: 0,
                color: "#f97316"
              }}
            >
              Admin Dashboard
            </h1>

            <p
              style={{
                color: "#a1a1aa"
              }}
            >
              Welcome, {user.name}
            </p>

          </div>


          <button
            onClick={handleLogout}
            style={{
              padding: "10px 18px",
              border: "none",
              borderRadius: "7px",
              background: "#dc2626",
              color: "#fff",
              cursor: "pointer",
              fontWeight: "600"
            }}
          >
            Logout
          </button>

        </div>


        {/* Admin Information */}

        <div
          style={{
            background: "#18181b",
            border: "1px solid #27272a",
            borderRadius: "12px",
            padding: "20px",
            marginBottom: "25px"
          }}
        >

          <h3
            style={{
              marginTop: 0
            }}
          >
            👤 Logged in as Admin
          </h3>

          <p>
            <strong>Name:</strong>{" "}
            {user.name}
          </p>

          <p>
            <strong>Email:</strong>{" "}
            {user.email}
          </p>

          <p>
            <strong>Role:</strong>{" "}

            <span
              style={{
                color: "#22c55e",
                fontWeight: "700"
              }}
            >
              {user.role}
            </span>

          </p>

        </div>


        {/* Admin Actions */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "20px"
          }}
        >

          {/* Add Product */}

          <AdminCard
            icon="➕"
            title="Add Product"
            description="Add a new product to ShopNest"
            onClick={() =>
              navigate("/admin/add-product")
            }
          />


          {/* Products */}

          <AdminCard
            icon="📦"
            title="Manage Products"
            description="View, edit and delete products"
            onClick={() =>
              navigate("/admin/products")
            }
          />


          {/* Orders */}

          <AdminCard
            icon="🛒"
            title="Orders"
            description="Manage customer orders"
            onClick={() =>
              navigate("/admin/orders")
            }
          />


          {/* Users */}

          <AdminCard
            icon="👥"
            title="Users"
            description="View registered customers"
            onClick={() =>
              navigate("/admin/users")
            }
          />

        </div>

      </div>

    </div>
  );
};


// ==========================================
// ADMIN CARD
// ==========================================

const AdminCard = ({
  icon,
  title,
  description,
  onClick
}) => {

  return (

    <button
      onClick={onClick}
      style={{
        textAlign: "left",
        background: "#18181b",
        border: "1px solid #27272a",
        borderRadius: "12px",
        padding: "25px",
        color: "#fff",
        cursor: "pointer",
        transition: "0.2s"
      }}
    >

      <div
        style={{
          fontSize: "32px",
          marginBottom: "12px"
        }}
      >
        {icon}
      </div>

      <h3
        style={{
          margin: "0 0 8px",
          color: "#f97316"
        }}
      >
        {title}
      </h3>

      <p
        style={{
          margin: 0,
          color: "#a1a1aa"
        }}
      >
        {description}
      </p>

    </button>

  );
};


export default AdminDashboard;