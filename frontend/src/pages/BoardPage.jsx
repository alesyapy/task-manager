import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/client";

function BoardPage() {
  const { id } = useParams();
  const [board, setBoard] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadBoard();
  }, [id]);

  async function loadBoard() {
    try {
      const response = await api.get(`/boards/${id}`);
      setBoard(response.data);
    } catch (err) {
      setError("Не удалось загрузить доску");
    }
  }

  if (error) {
    return <div style={{ padding: "40px" }}>{error}</div>;
  }

  if (!board) {
    return <div style={{ padding: "40px" }}>Загрузка...</div>;
  }

  return (
    <div style={{ padding: "40px" }}>
      <h1>{board.title}</h1>

      <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
        {board.columns.map((column) => (
          <div
            key={column.id}
            style={{
              minWidth: "250px",
              background: "#f3f3f3",
              padding: "16px",
              borderRadius: "8px",
            }}
          >
            <h3>{column.title}</h3>

            {column.cards.map((card) => (
              <div
                key={card.id}
                style={{
                  background: "white",
                  padding: "12px",
                  borderRadius: "8px",
                  marginBottom: "10px",
                }}
              >
                <strong>{card.title}</strong>
                {card.description && <p>{card.description}</p>}
                {card.dueDate && <p>Срок: {new Date(card.dueDate).toLocaleDateString()}</p>}

                {card.images?.length > 0 && (
                  <div>
                    {card.images.map((image) => (
                      <img
                        key={image.id}
                        src={`http://localhost:3000${image.url}`}
                        alt="card"
                        style={{ width: "100%", marginTop: "8px", borderRadius: "6px" }}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default BoardPage;