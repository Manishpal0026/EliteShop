import React, {
  useState,
  useContext
} from "react";

import {
  useNavigate
} from "react-router-dom";

import {
  AuthContext
} from "../context/AuthContext";


const AdminLogin = () => {

  const navigate = useNavigate();

  const {
    login
  } = useContext(AuthContext);


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  // ==========================================
  // ADMIN LOGIN
  // ==========================================

  const handleLogin = async (e) => {

    e.preventDefault();

    setError("");


    // Validate fields
    if (!email.trim() || !password) {

      setError(
        "Please enter email and password."
      );

      return;
    }


    setLoading(true);


    try {

      console.log(
        "Attempting admin login..."
      );


      const response = await fetch(
        "/api/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            email: email.trim(),
            password
          })
        }
      );


      const data =
        await response.json();


      // ==========================================
      // DEBUG LOGIN RESPONSE
      // ==========================================

      console.log(
        "================================"
      );

      console.log(
        "ADMIN LOGIN RESPONSE:",
        data
      );

      console.log(
        "ROLE RECEIVED:",
        data?.role
      );

      console.log(
        "================================"
      );


      // ==========================================
      // LOGIN FAILED
      // ==========================================

      if (!response.ok) {

        setError(
          data.message ||
          "Invalid email or password."
        );

        return;
      }


      // ==========================================
      // CHECK ADMIN ROLE
      // ==========================================

      const role =
        data?.role ||
        data?.user?.role;


      if (role !== "admin") {

        console.log(
          "Login rejected. Role:",
          role
        );

        setError(
          "This account is not an admin account."
        );

        return;
      }


      // ==========================================
      // SAVE THROUGH AUTH CONTEXT
      // ==========================================

      const loginSuccessful =
        login(data);


      if (!loginSuccessful) {

        setError(
          "Unable to save login information."
        );

        return;
      }


      console.log(
        "ADMIN LOGIN SUCCESSFUL"
      );


      // ==========================================
      // GO TO ADMIN DASHBOARD
      // ==========================================

      navigate(
        "/admin",
        {
          replace: true
        }
      );

    }

    catch (error) {

      console.error(
        "Admin login error:",
        error
      );

      setError(
        "Unable to connect to the server. Make sure your backend is running."
      );

    }

    finally {

      setLoading(false);

    }

  };


  return (

    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#09090b",
        padding: "30px 20px"
      }}
    >

      <div
        style={{
          width: "100%",
          maxWidth: "430px",
          background: "#18181b",
          border: "1px solid #27272a",
          borderRadius: "15px",
          padding: "40px",
          boxShadow:
            "0 15px 50px rgba(0,0,0,0.4)"
        }}
      >

        {/* HEADER */}

        <div
          style={{
            textAlign: "center",
            marginBottom: "30px"
          }}
        >

          <div
            style={{
              fontSize: "50px",
              marginBottom: "10px"
            }}
          >
            🔐
          </div>


          <h1
            style={{
              margin: 0,
              color: "#f97316",
              fontSize: "28px"
            }}
          >
            ShopNest Admin
          </h1>


          <p
            style={{
              color: "#a1a1aa",
              marginTop: "8px"
            }}
          >
            Administrator Login
          </p>

        </div>


        {/* ERROR */}

        {error && (

          <div
            style={{
              padding: "12px",
              marginBottom: "20px",
              background:
                "rgba(239,68,68,0.1)",
              border:
                "1px solid #ef4444",
              borderRadius: "7px",
              color: "#f87171",
              fontSize: "14px"
            }}
          >
            {error}
          </div>

        )}


        {/* FORM */}

        <form
          onSubmit={handleLogin}
        >

          {/* EMAIL */}

          <label
            style={{
              display: "block",
              color: "#d4d4d8",
              marginBottom: "7px",
              fontSize: "14px"
            }}
          >
            Admin Email
          </label>


          <input
            type="email"
            placeholder="Enter admin email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
            autoComplete="email"
            style={inputStyle}
          />


          {/* PASSWORD */}

          <label
            style={{
              display: "block",
              color: "#d4d4d8",
              marginTop: "18px",
              marginBottom: "7px",
              fontSize: "14px"
            }}
          >
            Admin Password
          </label>


          <input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
            autoComplete="current-password"
            style={inputStyle}
          />


          {/* LOGIN BUTTON */}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              marginTop: "25px",
              padding: "13px",
              border: "none",
              borderRadius: "7px",
              background: "#f97316",
              color: "#fff",
              fontSize: "16px",
              fontWeight: "700",
              cursor: loading
                ? "not-allowed"
                : "pointer",
              opacity: loading ? 0.7 : 1
            }}
          >

            {loading
              ? "Logging in..."
              : "Login as Admin"}

          </button>

        </form>


        {/* CUSTOMER LOGIN */}

        <button
          type="button"
          onClick={() =>
            navigate("/login")
          }
          style={{
            width: "100%",
            marginTop: "20px",
            padding: "11px",
            background: "transparent",
            border:
              "1px solid #3f3f46",
            borderRadius: "7px",
            color: "#a1a1aa",
            cursor: "pointer"
          }}
        >
          ← Customer Login
        </button>

      </div>

    </div>

  );

};


// ==========================================
// INPUT STYLE
// ==========================================

const inputStyle = {

  width: "100%",

  boxSizing: "border-box",

  padding: "13px",

  background: "#09090b",

  border:
    "1px solid #3f3f46",

  borderRadius: "7px",

  color: "#fff",

  fontSize: "15px",

  outline: "none"

};


export default AdminLogin;

