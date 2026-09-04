import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/auth.css';

const Login = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();


  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      const res = await fetch('/api/auth/login', {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({
          email,
          password
        })
      });


      const data = await res.json();

      console.log('================================');
      console.log('LOGIN RESPONSE:', data);
      console.log('================================');


      if (!res.ok) {

        alert(data.message || 'Login failed');

        return;
      }


      // Save login information
      login(data);


      // Detect admin role
      const role =
        data?.role ||
        data?.user?.role;


      console.log('Detected role:', role);


      // ==========================================
      // ADMIN LOGIN
      // ==========================================

      if (role === 'admin') {

        console.log('ADMIN LOGIN SUCCESS');

        navigate('/admin');

        return;
      }


      // ==========================================
      // NORMAL USER LOGIN
      // ==========================================

      console.log('NORMAL USER LOGIN SUCCESS');

      navigate('/');

    }

    catch (error) {

      console.error('Login error:', error);

      alert(
        'Unable to connect to server. Please try again.'
      );

    }

    finally {

      setLoading(false);

    }

  };


  return (

    <div className="auth-container">

      <form
        onSubmit={handleSubmit}
        className="auth-form"
      >

        <h2>Login</h2>


        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          required
        />


        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          required
        />


        <button
          type="submit"
          className="btn"
          disabled={loading}
        >

          {loading
            ? 'Logging in...'
            : 'Login'}

        </button>


        <p>

          Don't have an account?{' '}

          <Link to="/register">
            Register
          </Link>

        </p>


        <p>

          <Link to="/admin-login">
            Admin Login
          </Link>

        </p>

      </form>

    </div>

  );

};


export default Login;

