import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DragDropProvider, useDraggable, useDroppable } from "@dnd-kit/react";
import api from "../api/client";

function DraggableCard({
  card,
  columnId,
  onDeleteCard,
  onStartEditCard,
  onImageFileChange,
  onUploadImages,
  onDeleteImage,
  editForm,
  onEditCardChange,
  onUpdateCard,
  onCancelEditCard,
}) {
  const { ref: dragRef, handleRef, isDragging } = useDraggable({
    id: card.id,
  });

  const { ref: dropRef, isDropTarget } = useDroppable({
    id: `card-${card.id}`,
  });

  function setRefs(node) {
    dragRef(node);
    dropRef(node);
  }

  return (
    <div
      ref={setRefs}
      style={{
        background: isDropTarget ? "#fff7d6" : "white",
        padding: "12px",
        borderRadius: "8px",
        marginBottom: "10px",
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      {!editForm ? (
        <>
          <div
            ref={handleRef}
            style={{
              cursor: "grab",
              marginBottom: "8px",
              fontSize: "12px",
              color: "#666",
            }}
          >
            Перетащить
          </div>

          <strong>{card.title}</strong>

          {card.description && <p>{card.description}</p>}

          {card.dueDate && (
            <p>Срок: {new Date(card.dueDate).toLocaleDateString()}</p>
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
                    onClick={() => onDeleteImage(image.id)}
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
              onChange={(e) => onImageFileChange(card.id, e.target.files)}
            />
            <button
              type="button"
              onClick={() => onUploadImages(card.id)}
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
            <button type="button" onClick={() => onStartEditCard(card)}>
              Редактировать
            </button>
            <button type="button" onClick={() => onDeleteCard(card.id)}>
              Удалить
            </button>
          </div>
        </>
      ) : (
        <form
          onSubmit={(e) => onUpdateCard(e, card.id)}
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
              onEditCardChange(card.id, "title", e.target.value)
            }
            style={{ padding: "8px" }}
          />

          <textarea
            value={editForm.description}
            onChange={(e) =>
              onEditCardChange(card.id, "description", e.target.value)
            }
            style={{ padding: "8px" }}
          />

          <input
            type="date"
            value={editForm.dueDate}
            onChange={(e) =>
              onEditCardChange(card.id, "dueDate", e.target.value)
            }
            style={{ padding: "8px" }}
          />

          <div style={{ display: "flex", gap: "8px" }}>
            <button type="submit">Сохранить</button>
            <button type="button" onClick={() => onCancelEditCard(card.id)}>
              Отмена
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

function DroppableColumn({
  column,
  children,
  onStartEditColumn,
  onDeleteColumn,
  editColumnForm,
  onEditColumnChange,
  onUpdateColumn,
  onCancelEditColumn,
  cardForm,
  onCardFormChange,
  onCreateCard,
}) {
  const { ref, isDropTarget } = useDroppable({
    id: column.id,
  });

  return (
    <div
      ref={ref}
      style={{
        minWidth: "280px",
        background: isDropTarget ? "#e7f3ff" : "#f3f3f3",
        padding: "16px",
        borderRadius: "8px",
        transition: "background 0.2s",
      }}
    >
      {!editColumnForm ? (
        <>
          <h3>{column.title}</h3>
          <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
            <button type="button" onClick={() => onStartEditColumn(column)}>
              Редактировать колонку
            </button>
            <button type="button" onClick={() => onDeleteColumn(column.id)}>
              Удалить колонку
            </button>
          </div>
        </>
      ) : (
        <form
          onSubmit={(e) => onUpdateColumn(e, column.id)}
          style={{
            marginBottom: "12px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <input
            type="text"
            value={editColumnForm.title}
            onChange={(e) => onEditColumnChange(column.id, e.target.value)}
            style={{ padding: "8px" }}
          />
          <div style={{ display: "flex", gap: "8px" }}>
            <button type="submit">Сохранить</button>
            <button type="button" onClick={() => onCancelEditColumn(column.id)}>
              Отмена
            </button>
          </div>
        </form>
      )}

      {children}

      <form
        onSubmit={(e) => onCreateCard(e, column.id, column.cards.length)}
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
          value={cardForm.title || ""}
          onChange={(e) => onCardFormChange(column.id, "title", e.target.value)}
          style={{ padding: "8px" }}
        />

        <textarea
          placeholder="Описание"
          value={cardForm.description || ""}
          onChange={(e) =>
            onCardFormChange(column.id, "description", e.target.value)
          }
          style={{ padding: "8px" }}
        />

        <input
          type="date"
          value={cardForm.dueDate || ""}
          onChange={(e) => onCardFormChange(column.id, "dueDate", e.target.value)}
          style={{ padding: "8px" }}
        />

        <button type="submit">Добавить карточку</button>
      </form>
    </div>
  );
}

function BoardPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [board, setBoard] = useState(null);
  const [error, setError] = useState("");

  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [cardForms, setCardForms] = useState({});
  const [editingCards, setEditingCards] = useState({});
  const [imageFiles, setImageFiles] = useState({});
  const [editingColumns, setEditingColumns] = useState({});

  useEffect(() => {
    loadBoard();
  }, [id]);

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

    // если бросили на колонку — вставляем в конец
    const directColumn = board.columns.find((column) => column.id === targetId);
    if (directColumn) {
      targetColumnId = directColumn.id;
      insertIndex = directColumn.cards.length;
    }

    // если бросили на карточку — вставляем перед этой карточкой
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

    // убираем карточку из старой колонки
    const boardWithoutCard = {
      ...board,
      columns: board.columns.map((column) => ({
        ...column,
        cards: column.cards.filter((card) => card.id !== draggedCardId),
      })),
    };

    // если перенос внутри той же колонки и карточка стояла выше,
    // после удаления индекс нужно уменьшить на 1
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
      const targetColumn = updatedBoard.columns.find((column) => column.id === targetColumnId);

      // сохраняем moved card
      await api.patch(`/cards/${draggedCardId}`, {
        columnId: targetColumnId,
        order: insertIndex,
      });

      // обновляем order остальных карточек целевой колонки
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

  if (error) {
    return <div style={{ padding: "40px" }}>{error}</div>;
  }

  if (!board) {
    return <div style={{ padding: "40px" }}>Загрузка...</div>;
  }

  return (
    <DragDropProvider onDragEnd={handleDragEnd}>
      <div style={{ padding: "40px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <h1>{board.title}</h1>
          <button type="button" onClick={handleDeleteBoard}>
            Удалить доску
          </button>
        </div>

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
                    columnId={column.id}
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
        </div>
      </div>
    </DragDropProvider>
  );
}

export default BoardPage;