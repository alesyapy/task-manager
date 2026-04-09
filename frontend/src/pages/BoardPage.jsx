import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/client";

function BoardPage() {
  const { id } = useParams();

  const [board, setBoard] = useState(null);
  const [error, setError] = useState("");

  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [cardForms, setCardForms] = useState({});
  const [editingCards, setEditingCards] = useState({});
  const [imageFiles, setImageFiles] = useState({});

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

  async function handleCreateColumn(e) {
    e.preventDefault();

    try {
      await api.post("/columns", {
        title: newColumnTitle,
        boardId: id,
        order: board?.columns?.length ?? 0,
      });

      setNewColumnTitle("");
      loadBoard();
    } catch (err) {
      setError(err.response?.data?.error || "Не удалось создать колонку");
    }
  }

  function handleCardFormChange(columnId, field, value) {
    setCardForms((prev) => ({
      ...prev,
      [columnId]: {
        ...prev[columnId],
        [field]: value,
      },
    }));
  }

  async function handleCreateCard(e, columnId, cardsCount) {
    e.preventDefault();

    const form = cardForms[columnId] || {};

    try {
      await api.post("/cards", {
        title: form.title || "",
        description: form.description || "",
        dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : null,
        order: cardsCount,
        columnId,
      });

      setCardForms((prev) => ({
        ...prev,
        [columnId]: {
          title: "",
          description: "",
          dueDate: "",
        },
      }));

      loadBoard();
    } catch (err) {
      setError(err.response?.data?.error || "Не удалось создать карточку");
    }
  }

  async function handleDeleteCard(cardId) {
    try {
      await api.delete(`/cards/${cardId}`);
      loadBoard();
    } catch (err) {
      setError(err.response?.data?.error || "Не удалось удалить карточку");
    }
  }

  function startEditCard(card) {
    setEditingCards((prev) => ({
      ...prev,
      [card.id]: {
        title: card.title || "",
        description: card.description || "",
        dueDate: card.dueDate ? card.dueDate.slice(0, 10) : "",
      },
    }));
  }

  function handleEditCardChange(cardId, field, value) {
    setEditingCards((prev) => ({
      ...prev,
      [cardId]: {
        ...prev[cardId],
        [field]: value,
      },
    }));
  }

  async function handleUpdateCard(e, cardId) {
    e.preventDefault();

    const form = editingCards[cardId];

    try {
      await api.patch(`/cards/${cardId}`, {
        title: form.title,
        description: form.description,
        dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : null,
      });

      setEditingCards((prev) => {
        const copy = { ...prev };
        delete copy[cardId];
        return copy;
      });

      loadBoard();
    } catch (err) {
      setError(err.response?.data?.error || "Не удалось обновить карточку");
    }
  }

  function cancelEditCard(cardId) {
    setEditingCards((prev) => {
      const copy = { ...prev };
      delete copy[cardId];
      return copy;
    });
  }

  function handleImageFileChange(cardId, files) {
    setImageFiles((prev) => ({
      ...prev,
      [cardId]: files,
    }));
  }

  async function handleUploadImages(cardId) {
    try {
      const files = imageFiles[cardId];

      if (!files || files.length === 0) {
        setError("Выберите хотя бы один файл");
        return;
      }

      const formData = new FormData();

      for (const file of files) {
        formData.append("images", file);
      }

      await api.post(`/cards/${cardId}/images`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setImageFiles((prev) => {
        const copy = { ...prev };
        delete copy[cardId];
        return copy;
      });

      loadBoard();
    } catch (err) {
      setError(err.response?.data?.error || "Не удалось загрузить изображения");
    }
  }

  async function handleDeleteImage(imageId) {
    try {
      await api.delete(`/cards/images/${imageId}`);
      loadBoard();
    } catch (err) {
      setError(err.response?.data?.error || "Не удалось удалить изображение");
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

      <form onSubmit={handleCreateColumn} style={{ marginBottom: "24px" }}>
        <input
          type="text"
          placeholder="Название новой колонки"
          value={newColumnTitle}
          onChange={(e) => setNewColumnTitle(e.target.value)}
          style={{ padding: "8px", marginRight: "8px" }}
        />
        <button type="submit">Создать колонку</button>
      </form>

      <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
        {board.columns.map((column) => {
          const form = cardForms[column.id] || {};

          return (
            <div
              key={column.id}
              style={{
                minWidth: "280px",
                background: "#f3f3f3",
                padding: "16px",
                borderRadius: "8px",
              }}
            >
              <h3>{column.title}</h3>

              {column.cards.map((card) => {
                const editForm = editingCards[card.id];

                return (
                  <div
                    key={card.id}
                    style={{
                      background: "white",
                      padding: "12px",
                      borderRadius: "8px",
                      marginBottom: "10px",
                    }}
                  >
                    {!editForm ? (
                      <>
                        <strong>{card.title}</strong>

                        {card.description && <p>{card.description}</p>}

                        {card.dueDate && (
                          <p>
                            Срок: {new Date(card.dueDate).toLocaleDateString()}
                          </p>
                        )}

                        {card.images?.length > 0 && (
                          <div>
                            {card.images.map((image) => (
                              <div key={image.id} style={{ marginTop: "8px" }}>
                                <img
                                  src={`http://localhost:3000${image.url}`}
                                  alt="card"
                                  style={{
                                    width: "100%",
                                    borderRadius: "6px",
                                  }}
                                />
                                <button
                                  type="button"
                                  onClick={() => handleDeleteImage(image.id)}
                                  style={{ marginTop: "6px" }}
                                >
                                  Удалить изображение
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        <div style={{ marginTop: "12px" }}>
                          <input
                            type="file"
                            multiple
                            onChange={(e) =>
                              handleImageFileChange(card.id, e.target.files)
                            }
                          />
                          <button
                            type="button"
                            onClick={() => handleUploadImages(card.id)}
                            style={{ marginTop: "8px" }}
                          >
                            Загрузить изображение
                          </button>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            gap: "8px",
                            marginTop: "10px",
                          }}
                        >
                          <button type="button" onClick={() => startEditCard(card)}>
                            Редактировать
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCard(card.id)}
                          >
                            Удалить
                          </button>
                        </div>
                      </>
                    ) : (
                      <form
                        onSubmit={(e) => handleUpdateCard(e, card.id)}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                        }}
                      >
                        <input
                          type="text"
                          value={editForm.title}
                          onChange={(e) =>
                            handleEditCardChange(card.id, "title", e.target.value)
                          }
                          style={{ padding: "8px" }}
                        />

                        <textarea
                          value={editForm.description}
                          onChange={(e) =>
                            handleEditCardChange(
                              card.id,
                              "description",
                              e.target.value
                            )
                          }
                          style={{ padding: "8px" }}
                        />

                        <input
                          type="date"
                          value={editForm.dueDate}
                          onChange={(e) =>
                            handleEditCardChange(card.id, "dueDate", e.target.value)
                          }
                          style={{ padding: "8px" }}
                        />

                        <div style={{ display: "flex", gap: "8px" }}>
                          <button type="submit">Сохранить</button>
                          <button
                            type="button"
                            onClick={() => cancelEditCard(card.id)}
                          >
                            Отмена
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                );
              })}

              <form
                onSubmit={(e) =>
                  handleCreateCard(e, column.id, column.cards.length)
                }
                style={{
                  marginTop: "16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                <input
                  type="text"
                  placeholder="Название карточки"
                  value={form.title || ""}
                  onChange={(e) =>
                    handleCardFormChange(column.id, "title", e.target.value)
                  }
                  style={{ padding: "8px" }}
                />

                <textarea
                  placeholder="Описание"
                  value={form.description || ""}
                  onChange={(e) =>
                    handleCardFormChange(column.id, "description", e.target.value)
                  }
                  style={{ padding: "8px" }}
                />

                <input
                  type="date"
                  value={form.dueDate || ""}
                  onChange={(e) =>
                    handleCardFormChange(column.id, "dueDate", e.target.value)
                  }
                  style={{ padding: "8px" }}
                />

                <button type="submit">Добавить карточку</button>
              </form>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default BoardPage;