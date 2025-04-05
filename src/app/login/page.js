"use client";
import { useState } from "react";
import { useStore } from "@/store/hooks";
import { signIn } from "@/store/actions";
import authorizeAxiosInstance from "@/hooks/axios";
import AuthService from "@/service/AuthService";
import GuestGuard from "@/components/AuthProvider/GuestGuard";
require("dotenv").config();

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [state, dispatch] = useStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { accessToken, user } = await AuthService.singIn(email, password);
      if (typeof window !== "undefined") {
        window.localStorage.setItem("accessToken", accessToken);
        dispatch(signIn({ user }));
        // Redirecting to /product
        window.location.href = "/product";
      }
    } catch (error) {}
  };

  return (
    <GuestGuard>
      <div className="login-container">
        <h1>Login</h1>
        <form onSubmit={handleLogin}>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit">Login</button>
        </form>

        <style jsx>{`
          .login-container {
            max-width: 400px;
            margin: auto;
            padding: 20px;
            border: 1px solid #ccc;
            border-radius: 10px;
            text-align: center;
          }
          label {
            display: block;
            margin-bottom: 5px;
          }
          input {
            width: 100%;
            padding: 8px;
            margin-bottom: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
          }
          .error {
            color: red;
          }
          button {
            width: 100%;
            padding: 10px;
            background-color: #0070f3;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
          }
          button:hover {
            background-color: #005bb5;
          }
        `}</style>
      </div>
    </GuestGuard>
  );
}
