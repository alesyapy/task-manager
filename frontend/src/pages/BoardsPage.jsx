import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/client";

function BoardsPage() {
  const [boards, setBoards] = useState([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("username");

  useEffect(() => {
    if (!userId) {
      navigate("/");
      return;
    }

    loadBoards();
  }, []);

  async function loadBoards() {
    try {
      const response = await api.get("/boards");
      const userBoards = response.data.filter((board) => board.ownerId === userId);
      setBoards(userBoards);
    } catch (err) {
      setError("Не удалось загрузить доски");
    }
  }

  async function handleCreateBoard(e) {
    e.preventDefault();
    setError("");

    try {
      await api.post("/boards", {
        title,
        ownerId: userId,
      });

      setTitle("");
      loadBoards();
    } catch (err) {
      setError(err.response?.data?.error || "Не удалось создать доску");
    }
  }

  function handleLogout() {
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    navigate("/");
  }

  return (
    <div style={{ padding: "40px" }}>
      <h1>Мои доски</h1>
      <p>Пользователь: {username}</p>

      <button onClick={handleLogout} style={{ marginBottom: "20px" }}>
        Выйти
      </button>

      <form onSubmit={handleCreateBoard} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Название доски"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ padding: "8px", marginRight: "8px" }}
        />
        <button type="submit">Создать доску</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul>
        {boards.map((board) => (
          <li key={board.id}>
            <Link to={`/boards/${board.id}`}>{board.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BoardsPage;