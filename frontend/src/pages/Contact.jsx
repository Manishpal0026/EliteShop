import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  Headphones,
} from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Contact form submitted:", formData);

    setSubmitted(true);

    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });

    setTimeout(() => {
      setSubmitted(false);
    }, 4000);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#09090b",
        color: "#fff",
        padding: "50px 20px 80px",
      }}
    >
      {/* =========================================
          HEADER
      ========================================== */}

      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto 50px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(249,115,22,0.12)",
            border: "1px solid rgba(249,115,22,0.3)",
            color: "#f97316",
            padding: "8px 15px",
            borderRadius: "30px",
            fontSize: "14px",
            fontWeight: "600",
            marginBottom: "18px",
          }}
        >
          <MessageCircle size={17} />
          We'd Love To Hear From You
        </div>

        <h1
          style={{
            fontSize: "clamp(32px, 5vw, 52px)",
            margin: "0 0 15px",
            fontWeight: "800",
          }}
        >
          Contact <span style={{ color: "#f97316" }}>ShopNest</span>
        </h1>

        <p
          style={{
            maxWidth: "650px",
            margin: "0 auto",
            color: "#a1a1aa",
            fontSize: "17px",
            lineHeight: "1.7",
          }}
        >
          Have a question about an order, product, delivery, or anything
          else? Our support team is here to help.
        </p>
      </div>

      {/* =========================================
          CONTACT CONTENT
      ========================================== */}

      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "30px",
        }}
      >
        {/* =====================================
            LEFT SIDE - CONTACT INFORMATION
        ====================================== */}

        <div>
          <h2
            style={{
              fontSize: "28px",
              marginBottom: "10px",
            }}
          >
            Get in Touch
          </h2>

          <p
            style={{
              color: "#a1a1aa",
              lineHeight: "1.7",
              marginBottom: "30px",
            }}
          >
            We're always happy to help. Reach out to us using any of the
            options below and we'll get back to you as soon as possible.
          </p>

          {/* EMAIL */}

          <div style={infoCardStyle}>
            <div style={iconStyle}>
              <Mail size={22} />
            </div>

            <div>
              <h3 style={infoTitleStyle}>Email Us</h3>

              <p style={infoTextStyle}>
                pmanish1326@gmail.com
              </p>

              <p style={smallTextStyle}>
                We usually respond within 24 hours.
              </p>
            </div>
          </div>

          {/* PHONE */}

          <div style={infoCardStyle}>
            <div style={iconStyle}>
              <Phone size={22} />
            </div>

            <div>
              <h3 style={infoTitleStyle}>Call Us</h3>

              <p style={infoTextStyle}>
                +91 94735 71809
              </p>

              <p style={smallTextStyle}>
                Monday - Saturday
              </p>
            </div>
          </div>

          {/* LOCATION */}

          <div style={infoCardStyle}>
            <div style={iconStyle}>
              <MapPin size={22} />
            </div>

            <div>
              <h3 style={infoTitleStyle}>Our Location</h3>

              <p style={infoTextStyle}>
                Bhopal, Madhya Pradesh, India
              </p>

              <p style={smallTextStyle}>
                Serving customers across India
              </p>
            </div>
          </div>

          {/* WORKING HOURS */}

          <div style={infoCardStyle}>
            <div style={iconStyle}>
              <Clock size={22} />
            </div>

            <div>
              <h3 style={infoTitleStyle}>Business Hours</h3>

              <p style={infoTextStyle}>
                Mon - Sat: 9:00 AM - 7:00 PM
              </p>

              <p style={smallTextStyle}>
                Sunday: Closed
              </p>
            </div>
          </div>
        </div>

        {/* =====================================
            RIGHT SIDE - CONTACT FORM
        ====================================== */}

        <div
          style={{
            background: "#18181b",
            border: "1px solid #27272a",
            borderRadius: "16px",
            padding: "30px",
            boxShadow: "0 15px 40px rgba(0,0,0,0.25)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "10px",
            }}
          >
            <Headphones
              size={26}
              color="#f97316"
            />

            <h2
              style={{
                margin: 0,
                fontSize: "25px",
              }}
            >
              Send Us a Message
            </h2>
          </div>

          <p
            style={{
              color: "#a1a1aa",
              marginBottom: "25px",
            }}
          >
            Fill out the form and our support team will contact you.
          </p>

          {/* SUCCESS MESSAGE */}

          {submitted && (
            <div
              style={{
                background: "rgba(34,197,94,0.12)",
                border: "1px solid #22c55e",
                color: "#4ade80",
                padding: "13px",
                borderRadius: "8px",
                marginBottom: "20px",
              }}
            >
              ✓ Thank you! Your message has been received.
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* NAME */}

            <label style={labelStyle}>
              Your Name
            </label>

            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
              style={inputStyle}
            />

            {/* EMAIL */}

            <label style={labelStyle}>
              Email Address
            </label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              style={inputStyle}
            />

            {/* SUBJECT */}

            <label style={labelStyle}>
              Subject
            </label>

            <input
              type="text"
              name="subject"
              placeholder="What can we help you with?"
              value={formData.subject}
              onChange={handleChange}
              required
              style={inputStyle}
            />

            {/* MESSAGE */}

            <label style={labelStyle}>
              Message
            </label>

            <textarea
              name="message"
              placeholder="Write your message here..."
              rows="6"
              value={formData.message}
              onChange={handleChange}
              required
              style={{
                ...inputStyle,
                resize: "vertical",
                minHeight: "130px",
              }}
            />

            {/* SUBMIT */}

            <button
              type="submit"
              style={{
                width: "100%",
                padding: "14px",
                marginTop: "5px",
                border: "none",
                borderRadius: "8px",
                background: "#f97316",
                color: "#fff",
                fontSize: "16px",
                fontWeight: "700",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              <Send size={18} />
              Send Message
            </button>
          </form>
        </div>
      </div>

      {/* =========================================
          FAQ / SUPPORT SECTION
      ========================================== */}

      <div
        style={{
          maxWidth: "1100px",
          margin: "60px auto 0",
          padding: "30px",
          background: "#18181b",
          border: "1px solid #27272a",
          borderRadius: "16px",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            marginTop: 0,
            fontSize: "26px",
          }}
        >
          Need Quick Help?
        </h2>

        <p
          style={{
            color: "#a1a1aa",
            lineHeight: "1.7",
          }}
        >
          You can also check your orders, review our return policy, or
          browse our shop for more information.
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "12px",
            flexWrap: "wrap",
            marginTop: "20px",
          }}
        >
          <a href="/shop" style={linkButtonStyle}>
            Browse Shop
          </a>

          <a href="/ordersuccess" style={secondaryButtonStyle}>
            My Orders
          </a>

          <a href="/return" style={secondaryButtonStyle}>
            Return Policy
          </a>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// STYLES
// ==========================================

const infoCardStyle = {
  display: "flex",
  gap: "15px",
  padding: "18px",
  marginBottom: "15px",
  background: "#18181b",
  border: "1px solid #27272a",
  borderRadius: "12px",
};

const iconStyle = {
  minWidth: "45px",
  height: "45px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "rgba(249,115,22,0.12)",
  color: "#f97316",
  borderRadius: "10px",
};

const infoTitleStyle = {
  margin: "0 0 5px",
  fontSize: "16px",
};

const infoTextStyle = {
  margin: "0 0 3px",
  color: "#f4f4f5",
};

const smallTextStyle = {
  margin: 0,
  color: "#71717a",
  fontSize: "13px",
};

const labelStyle = {
  display: "block",
  color: "#d4d4d8",
  fontSize: "14px",
  fontWeight: "600",
  marginBottom: "7px",
  marginTop: "15px",
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "13px",
  background: "#09090b",
  border: "1px solid #3f3f46",
  borderRadius: "8px",
  color: "#fff",
  fontSize: "15px",
  outline: "none",
};

const linkButtonStyle = {
  display: "inline-block",
  padding: "11px 20px",
  background: "#f97316",
  color: "#fff",
  textDecoration: "none",
  borderRadius: "7px",
  fontWeight: "600",
};

const secondaryButtonStyle = {
  display: "inline-block",
  padding: "11px 20px",
  background: "transparent",
  color: "#d4d4d8",
  textDecoration: "none",
  border: "1px solid #3f3f46",
  borderRadius: "7px",
  fontWeight: "600",
};

export default Contact;

