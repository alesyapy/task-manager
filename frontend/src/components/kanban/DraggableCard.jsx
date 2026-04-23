import { useDraggable, useDroppable } from "@dnd-kit/react";
import { Pencil, Trash2 } from "lucide-react";
import Button from "../ui/Button";
import Input from "../ui/Input";

function DraggableCard({
  card,
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
        background: "rgba(255,255,255,0.72)",
        border: isDropTarget
          ? "1px solid rgba(77,159,230,0.45)"
          : "1px solid rgba(255,255,255,0.7)",
        borderRadius: "20px",
        padding: "16px",
        boxShadow: isDragging
          ? "0 16px 28px rgba(77,159,230,0.18)"
          : "0 8px 20px rgba(110,160,210,0.10)",
        backdropFilter: "blur(10px)",
        opacity: isDragging ? 0.85 : 1,
        transform: isDragging ? "scale(1.02)" : "scale(1)",
        transition: "0.2s ease",
      }}
    >
      {!editForm ? (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "12px",
              gap: "12px",
            }}
          >
            <div
              ref={handleRef}
              style={{
                padding: "6px 10px",
                borderRadius: "999px",
                background: "rgba(124,194,246,0.18)",
                color: "var(--color-primary-strong)",
                fontSize: "12px",
                fontWeight: "700",
                cursor: "grab",
              }}
            >
              Перетащить
            </div>

            <div
              style={{
                display: "flex",
                gap: "8px",
                alignItems: "center",
                flexShrink: 0,
              }}
            >
              <button
                type="button"
                onClick={() => onStartEditCard(card)}
                title="Редактировать карточку"
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "10px",
                  border: "1px solid rgba(124,194,246,0.28)",
                  background: "rgba(255,255,255,0.82)",
                  color: "var(--color-primary-strong)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 6px 14px rgba(110,160,210,0.08)",
                  cursor: "pointer",
                }}
              >
                <Pencil size={15} />
              </button>

              <button
                type="button"
                onClick={() => onDeleteCard(card.id)}
                title="Удалить карточку"
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "10px",
                  border: "1px solid rgba(220,107,107,0.20)",
                  background: "rgba(255,240,240,0.9)",
                  color: "#c75b5b",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 6px 14px rgba(199,91,91,0.08)",
                  cursor: "pointer",
                }}
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>

          <h4
            style={{
              fontSize: "20px",
              color: "var(--color-text)",
              marginBottom: "10px",
              wordBreak: "break-word",
            }}
          >
            {card.title}
          </h4>

          {card.description && (
            <p
              style={{
                color: "var(--color-text-secondary)",
                lineHeight: "1.6",
                fontSize: "15px",
                marginBottom: "12px",
                whiteSpace: "pre-wrap",
              }}
            >
              {card.description}
            </p>
          )}

          {card.dueDate && (
            <p
              style={{
                color: "var(--color-primary-strong)",
                fontWeight: "600",
                fontSize: "14px",
                marginBottom: "12px",
              }}
            >
              Срок: {new Date(card.dueDate).toLocaleDateString()}
            </p>
          )}

          {card.images?.length > 0 && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                marginBottom: "14px",
              }}
            >
              {card.images.map((image) => (
                <div key={image.id}>
                  <img
                    src={`http://localhost:3000${image.url}`}
                    alt="card"
                    style={{
                      width: "100%",
                      borderRadius: "16px",
                      display: "block",
                      marginBottom: "8px",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => onDeleteImage(image.id)}
                    style={{
                      padding: "8px 12px",
                      borderRadius: "12px",
                      border: "1px solid rgba(220, 107, 107, 0.20)",
                      background: "rgba(255, 240, 240, 0.9)",
                      color: "#c75b5b",
                      fontSize: "13px",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    Удалить изображение
                  </button>
                </div>
              ))}
            </div>
          )}

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              marginBottom: "14px",
            }}
          >
            <input
              type="file"
              multiple
              onChange={(e) => onImageFileChange(card.id, e.target.files)}
              style={{
                fontSize: "13px",
                color: "var(--color-text-secondary)",
              }}
            />
            <Button type="button" onClick={() => onUploadImages(card.id)}>
              Загрузить изображения
            </Button>
          </div>
        </>
      ) : (
        <form
          onSubmit={(e) => onUpdateCard(e, card.id)}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <Input
            type="text"
            value={editForm.title}
            onChange={(e) =>
              onEditCardChange(card.id, "title", e.target.value)
            }
          />

          <textarea
            value={editForm.description}
            onChange={(e) =>
              onEditCardChange(card.id, "description", e.target.value)
            }
            style={{
              minHeight: "100px",
              border: "1px solid var(--color-border)",
              borderRadius: "18px",
              padding: "12px 14px",
              fontSize: "14px",
              resize: "vertical",
              background: "rgba(255,255,255,0.75)",
              outline: "none",
            }}
          />

          <input
            type="date"
            value={editForm.dueDate}
            onChange={(e) =>
              onEditCardChange(card.id, "dueDate", e.target.value)
            }
            style={{
              border: "1px solid var(--color-border)",
              borderRadius: "18px",
              padding: "12px 14px",
              background: "rgba(255,255,255,0.75)",
            }}
          />

          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            <Button type="submit">Сохранить</Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => onCancelEditCard(card.id)}
            >
              Отмена
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

export default DraggableCard;