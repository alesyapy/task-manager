import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DragDropProvider } from "@dnd-kit/react";
import api from "../api/client";
import DraggableCard from "../components/kanban/DraggableCard";
import DroppableColumn from "../components/kanban/DroppableColumn";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Card from "../components/ui/Card";
import PageContainer from "../components/layout/PageContainer";

function BoardPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [board, setBoard] = useState(null);
  const [error, setError] = useState("");
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [showCreateColumnForm, setShowCreateColumnForm] = useState(false);
  const [cardForms, setCardForms] = useState({});
  const [editingCards, setEditingCards] = useState({});
  const [imageFiles, setImageFiles] = useState({});
  const [editingColumns, setEditingColumns] = useState({});
  const [isMobile, setIsMobile] = useState(window.innerWidth < 900);

  useEffect(() => {
    loadBoard();
  }, [id]);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 900);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  async function loadBoard() {
    try {
      const response = await api.get(`/boards/${id}`);
      setBoard(response.data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || "Не удалось загрузить доску");
    }
  }

  async function handleCreateColumn(e) {
    e.preventDefault();

    if (!newColumnTitle.trim()) {
      setError("Введите название колонки");
      return;
    }

    try {
      await api.post("/columns", {
        title: newColumnTitle.trim(),
        boardId: id,
        order: board?.columns?.length ?? 0,
      });

      setNewColumnTitle("");
      setShowCreateColumnForm(false);
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

  function startEditColumn(column) {
    setEditingColumns((prev) => ({
      ...prev,
      [column.id]: {
        title: column.title || "",
      },
    }));
  }

  function handleEditColumnChange(columnId, value) {
    setEditingColumns((prev) => ({
      ...prev,
      [columnId]: {
        title: value,
      },
    }));
  }

  async function handleUpdateColumn(e, columnId) {
    e.preventDefault();

    const form = editingColumns[columnId];

    try {
      await api.patch(`/columns/${columnId}`, {
        title: form.title,
      });

      setEditingColumns((prev) => {
        const copy = { ...prev };
        delete copy[columnId];
        return copy;
      });

      loadBoard();
    } catch (err) {
      setError(err.response?.data?.error || "Не удалось обновить колонку");
    }
  }

  function cancelEditColumn(columnId) {
    setEditingColumns((prev) => {
      const copy = { ...prev };
      delete copy[columnId];
      return copy;
    });
  }

  async function handleDeleteColumn(columnId) {
    try {
      await api.delete(`/columns/${columnId}`);
      loadBoard();
    } catch (err) {
      setError(err.response?.data?.error || "Не удалось удалить колонку");
    }
  }

  async function handleDeleteBoard() {
    const confirmed = window.confirm("Удалить эту доску?");
    if (!confirmed) return;

    try {
      await api.delete(`/boards/${id}`);
      navigate("/boards");
    } catch (err) {
      setError(err.response?.data?.error || "Не удалось удалить доску");
    }
  }

  async function handleDragEnd(event) {
    if (event.canceled) return;

    const draggedCardId = event.operation.source?.id;
    const targetId = event.operation.target?.id;

    if (!draggedCardId || !targetId) return;

    let sourceColumn = null;
    let movedCard = null;

    for (const column of board.columns) {
      const found = column.cards.find((card) => card.id === draggedCardId);
      if (found) {
        sourceColumn = column;
        movedCard = found;
        break;
      }
    }

    if (!sourceColumn || !movedCard) return;

    let targetColumnId = null;
    let insertIndex = null;

    const directColumn = board.columns.find((column) => column.id === targetId);
    if (directColumn) {
      targetColumnId = directColumn.id;
      insertIndex = directColumn.cards.length;
    }

    if (targetId.startsWith("card-")) {
      const targetCardId = targetId.replace("card-", "");

      for (const column of board.columns) {
        const index = column.cards.findIndex((card) => card.id === targetCardId);
        if (index !== -1) {
          targetColumnId = column.id;
          insertIndex = index;
          break;
        }
      }
    }

    if (targetColumnId === null || insertIndex === null) return;

    const previousBoard = board;

    const boardWithoutCard = {
      ...board,
      columns: board.columns.map((column) => ({
        ...column,
        cards: column.cards.filter((card) => card.id !== draggedCardId),
      })),
    };

    if (sourceColumn.id === targetColumnId) {
      const oldIndex = sourceColumn.cards.findIndex((card) => card.id === draggedCardId);
      if (oldIndex !== -1 && oldIndex < insertIndex) {
        insertIndex -= 1;
      }
    }

    const newColumns = boardWithoutCard.columns.map((column) => {
      if (column.id !== targetColumnId) return column;

      const newCards = [...column.cards];
      newCards.splice(insertIndex, 0, { ...movedCard, columnId: targetColumnId });

      return {
        ...column,
        cards: newCards.map((card, index) => ({
          ...card,
          order: index,
        })),
      };
    });

    const updatedBoard = {
      ...boardWithoutCard,
      columns: newColumns,
    };

    setBoard(updatedBoard);

    try {
      const targetColumn = updatedBoard.columns.find(
        (column) => column.id === targetColumnId
      );

      await api.patch(`/cards/${draggedCardId}`, {
        columnId: targetColumnId,
        order: insertIndex,
      });

      const patchRequests = targetColumn.cards.map((card, index) =>
        api.patch(`/cards/${card.id}`, {
          order: index,
        })
      );

      await Promise.all(patchRequests);
    } catch (err) {
      setBoard(previousBoard);
      setError(err.response?.data?.error || "Не удалось переместить карточку");
    }
  }

  if (!board && !error) {
    return (
      <PageContainer
        style={{
          minHeight: "100vh",
          paddingTop: "60px",
        }}
      >
        <Card>
          <p style={{ color: "var(--color-text-secondary)" }}>Загрузка доски...</p>
        </Card>
      </PageContainer>
    );
  }

  return (
    <DragDropProvider onDragEnd={handleDragEnd}>
      <PageContainer
        style={{
          minHeight: "100vh",
          paddingTop: isMobile ? "32px" : "52px",
          paddingBottom: "40px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "60px",
            left: "20px",
            width: "220px",
            height: "220px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.35)",
            filter: "blur(24px)",
            display: isMobile ? "none" : "block",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: "180px",
            right: "40px",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "rgba(190, 225, 255, 0.28)",
            filter: "blur(28px)",
            display: isMobile ? "none" : "block",
          }}
        />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              justifyContent: "space-between",
              alignItems: isMobile ? "flex-start" : "center",
              gap: "20px",
              marginBottom: "28px",
            }}
          >
            <div>
              <p
                style={{
                  color: "var(--color-primary-strong)",
                  fontWeight: "700",
                  fontSize: "17px",
                  marginBottom: "10px",
                }}
              >
                Task Manager
              </p>

              <h1
                style={{
                  fontSize: isMobile ? "38px" : "52px",
                  lineHeight: "1.08",
                  color: "var(--color-text)",
                  marginBottom: "12px",
                  wordBreak: "break-word",
                }}
              >
                {board?.title || "Доска"}
              </h1>

              <p
                style={{
                  color: "var(--color-text-secondary)",
                  fontSize: isMobile ? "16px" : "18px",
                  lineHeight: "1.7",
                  maxWidth: "720px",
                }}
              >
                Управляй колонками, карточками и перемещай задачи между этапами.
              </p>
            </div>

            <div
              style={{
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate("/boards")}
              >
                Назад
              </Button>
              <Button
                type="button"
                variant="danger"
                onClick={handleDeleteBoard}
              >
                Удалить доску
              </Button>
            </div>
          </div>

          {error && (
            <div
              style={{
                marginBottom: "20px",
                background: "#ffe8e8",
                color: "#a63c3c",
                padding: "12px 14px",
                borderRadius: "14px",
                fontSize: "14px",
              }}
            >
              {error}
            </div>
          )}

          <Card
            style={{
              marginBottom: "26px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: isMobile ? "flex-start" : "center",
                flexDirection: isMobile ? "column" : "row",
                gap: "14px",
              }}
            >
              <div>
                <h2
                  style={{
                    fontSize: "28px",
                    color: "var(--color-text)",
                    marginBottom: "10px",
                  }}
                >
                  Колонки доски
                </h2>

                <p
                  style={{
                    color: "var(--color-text-secondary)",
                    fontSize: "15px",
                    lineHeight: "1.6",
                  }}
                >
                  Добавляй новые этапы работы по мере необходимости.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowCreateColumnForm((prev) => !prev)}
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "18px",
                  border: "1px solid rgba(124,194,246,0.35)",
                  background: "rgba(255,255,255,0.72)",
                  color: "var(--color-primary-strong)",
                  fontSize: "30px",
                  fontWeight: "500",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 10px 24px rgba(110,160,210,0.12)",
                }}
                title="Создать колонку"
              >
                +
              </button>
            </div>

            {showCreateColumnForm && (
              <form
                onSubmit={handleCreateColumn}
                style={{
                  display: "flex",
                  flexDirection: isMobile ? "column" : "row",
                  gap: "12px",
                  alignItems: "stretch",
                  marginTop: "20px",
                }}
              >
                <div style={{ flex: 1 }}>
                  <Input
                    type="text"
                    placeholder="Название новой колонки"
                    value={newColumnTitle}
                    onChange={(e) => setNewColumnTitle(e.target.value)}
                  />
                </div>

                <Button type="submit">Создать колонку</Button>

                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setShowCreateColumnForm(false);
                    setNewColumnTitle("");
                  }}
                >
                  Отмена
                </Button>
              </form>
            )}
          </Card>

          <div
            style={{
              display: "flex",
              gap: "20px",
              overflowX: "auto",
              paddingBottom: "10px",
            }}
          >
            {board?.columns?.map((column) => {
              const form = cardForms[column.id] || {};
              const editColumnForm = editingColumns[column.id];

              return (
                <DroppableColumn
                  key={column.id}
                  column={column}
                  onStartEditColumn={startEditColumn}
                  onDeleteColumn={handleDeleteColumn}
                  editColumnForm={editColumnForm}
                  onEditColumnChange={handleEditColumnChange}
                  onUpdateColumn={handleUpdateColumn}
                  onCancelEditColumn={cancelEditColumn}
                  cardForm={form}
                  onCardFormChange={handleCardFormChange}
                  onCreateCard={handleCreateCard}
                >
                  {column.cards.map((card) => (
                    <DraggableCard
                      key={card.id}
                      card={card}
                      onDeleteCard={handleDeleteCard}
                      onStartEditCard={startEditCard}
                      onImageFileChange={handleImageFileChange}
                      onUploadImages={handleUploadImages}
                      onDeleteImage={handleDeleteImage}
                      editForm={editingCards[card.id]}
                      onEditCardChange={handleEditCardChange}
                      onUpdateCard={handleUpdateCard}
                      onCancelEditCard={cancelEditCard}
                    />
                  ))}
                </DroppableColumn>
              );
            })}

            {board?.columns?.length === 0 && (
              <Card
                style={{
                  minWidth: "320px",
                }}
              >
                <h3
                  style={{
                    fontSize: "24px",
                    color: "var(--color-text)",
                    marginBottom: "10px",
                  }}
                >
                  Пока нет колонок
                </h3>
                <p
                  style={{
                    color: "var(--color-text-secondary)",
                    lineHeight: "1.6",
                  }}
                >
                  Нажми на плюс сверху, чтобы создать первую колонку.
                </p>
              </Card>
            )}
          </div>
        </div>
      </PageContainer>
    </DragDropProvider>
  );
}

export default BoardPage;