import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setError("");

    try {
      const response = await api.post("/auth/login", {
        username,
      });

      localStorage.setItem("userId", response.data.id);
      localStorage.setItem("username", response.data.username);

      navigate("/boards");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  }

  return (
    <div style={{ padding: "40px" }}>
      <h1>Вход</h1>

      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Введите username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ padding: "8px", marginRight: "8px" }}
        />
        <button type="submit">Войти</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default LoginPage;