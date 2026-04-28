import { useState } from "react";
import { ImagePlus, Pencil, Trash2, X } from "lucide-react";
import Button from "../ui/Button";
import Input from "../ui/Input";

function CardModal({
  card,
  editForm,
  onClose,
  onStartEdit,
  onEditChange,
  onSave,
  onImageFileChange,
  onUploadImages,
  onDeleteImage,
}) {
  const [isEditing, setIsEditing] = useState(false);

  if (!card) return null;

  function handleStartEdit() {
    onStartEdit(card);
    setIsEditing(true);
  }

  function handleCancelEdit() {
    setIsEditing(false);
  }

  async function handleSave(e) {
    await onSave(e, card.id);
    setIsEditing(false);
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15, 35, 55, 0.45)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999,
        padding: "20px",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "760px",
          maxWidth: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          background: "rgba(255,255,255,0.92)",
          border: "1px solid rgba(255,255,255,0.75)",
          borderRadius: "26px",
          padding: "26px",
          boxShadow: "0 20px 60px rgba(60, 120, 180, 0.25)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "16px",
            marginBottom: "20px",
          }}
        >
          <h2
            style={{
              fontSize: "30px",
              color: "var(--color-text)",
            }}
          >
            Карточка
          </h2>

          <div style={{ display: "flex", gap: "8px" }}>
            {!isEditing && (
              <button
                type="button"
                onClick={handleStartEdit}
                title="Редактировать"
                style={iconButtonStyle}
              >
                <Pencil size={18} />
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              title="Закрыть"
              style={iconButtonStyle}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {!isEditing ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <h3
              style={{
                fontSize: "26px",
                color: "var(--color-text)",
              }}
            >
              {card.title}
            </h3>

            {card.description ? (
              <p
                style={{
                  color: "var(--color-text-secondary)",
                  fontSize: "16px",
                  lineHeight: "1.7",
                  whiteSpace: "pre-wrap",
                }}
              >
                {card.description}
              </p>
            ) : (
              <p
                style={{
                  color: "var(--color-text-secondary)",
                  fontSize: "15px",
                }}
              >
                Описание не добавлено.
              </p>
            )}

            {card.dueDate && (
              <p
                style={{
                  color: "var(--color-primary-strong)",
                  fontWeight: "700",
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
                  gap: "16px",
                }}
              >
                {card.images.map((img) => (
                  <img
                    key={img.id}
                    src={`http://localhost:3000${img.url}`}
                    alt="Изображение карточки"
                    style={{
                      width: "100%",
                      maxHeight: "520px",
                      objectFit: "contain",
                      borderRadius: "18px",
                      background: "rgba(240,248,255,0.7)",
                      display: "block",
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <form
            onSubmit={handleSave}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}
          >
            <Input
              value={editForm?.title || ""}
              onChange={(e) => onEditChange(card.id, "title", e.target.value)}
            />

            <textarea
              value={editForm?.description || ""}
              onChange={(e) =>
                onEditChange(card.id, "description", e.target.value)
              }
              style={{
                minHeight: "130px",
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
              value={editForm?.dueDate || ""}
              onChange={(e) => onEditChange(card.id, "dueDate", e.target.value)}
              style={{
                border: "1px solid var(--color-border)",
                borderRadius: "18px",
                padding: "12px 14px",
                background: "rgba(255,255,255,0.75)",
              }}
            />

            {card.images?.length > 0 && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                {card.images.map((img) => (
                  <div key={img.id}>
                    <img
                      src={`http://localhost:3000${img.url}`}
                      alt="Изображение карточки"
                      style={{
                        width: "100%",
                        maxHeight: "520px",
                        objectFit: "contain",
                        borderRadius: "18px",
                        background: "rgba(240,248,255,0.7)",
                        display: "block",
                        marginBottom: "10px",
                      }}
                    />

                    <button
                      type="button"
                      onClick={() => onDeleteImage(img.id)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "9px 13px",
                        borderRadius: "14px",
                        border: "1px solid rgba(220,107,107,0.20)",
                        background: "rgba(255,240,240,0.9)",
                        color: "#c75b5b",
                        fontSize: "14px",
                        fontWeight: "600",
                        cursor: "pointer",
                      }}
                    >
                      <Trash2 size={16} />
                      Удалить изображение
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div>
              <input
                id={`modal-images-${card.id}`}
                type="file"
                multiple
                onChange={(e) => {
                  const files = e.target.files;
                  onImageFileChange(card.id, files);
                  onUploadImages(card.id, files);
                  e.target.value = "";
                }}
                style={{ display: "none" }}
              />

              <label
                htmlFor={`modal-images-${card.id}`}
                title="Добавить изображения"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "11px 15px",
                  borderRadius: "16px",
                  border: "1px solid rgba(124,194,246,0.35)",
                  background: "rgba(255,255,255,0.85)",
                  color: "var(--color-primary-strong)",
                  cursor: "pointer",
                  fontWeight: "600",
                  boxShadow: "0 8px 18px rgba(110,160,210,0.10)",
                }}
              >
                <ImagePlus size={18} />
                Добавить изображения
              </label>
            </div>

            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
                marginTop: "4px",
              }}
            >
              <Button type="submit">Сохранить</Button>
              <Button
                type="button"
                variant="secondary"
                onClick={handleCancelEdit}
              >
                Отмена
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

const iconButtonStyle = {
  width: "38px",
  height: "38px",
  borderRadius: "12px",
  border: "1px solid rgba(124,194,246,0.28)",
  background: "rgba(255,255,255,0.82)",
  color: "var(--color-primary-strong)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
};

export default CardModal;