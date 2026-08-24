import React, { useState } from "react";
import API from "../api";
import './Login.css';


function Login({ onLogin, onRegister }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await API.post("token/", {
        username,
        password,
      });

      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);

      onLogin();

      alert("Login successful!");
    } catch (error) {
      alert("Invalid username or password");
    }
  };

 return (
    <div className="login-container">
        <div className="login-card">

            <div className="login-logo">
                Campusly 🎓
            </div>

            <p className="login-subtitle">
                Welcome back! Sign in to your campus.
            </p>

            <form className="login-form" onSubmit={handleLogin}>

                <label>Username</label>
                <input
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />

                <label>Password</label>
                <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button className="login-button" type="submit">
                    Sign In
                </button>

            </form>

            <p className="auth-switch">
    New to Campusly?
    <button type="button" onClick={onRegister}>
        Create an account
    </button>
</p>

        </div>
    </div>
);
}

export default Login;
