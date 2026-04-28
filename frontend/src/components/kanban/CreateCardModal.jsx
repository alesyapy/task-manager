import { X } from "lucide-react";
import Button from "../ui/Button";
import Input from "../ui/Input";

function CreateCardModal({
  column,
  cardForm,
  onClose,
  onCardFormChange,
  onCreateCard,
}) {
  if (!column) return null;

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
          width: "620px",
          maxWidth: "100%",
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
          <div>
            <h2
              style={{
                fontSize: "30px",
                color: "var(--color-text)",
                marginBottom: "8px",
              }}
            >
              Новая карточка
            </h2>

            <p
              style={{
                color: "var(--color-text-secondary)",
                fontSize: "15px",
              }}
            >
              Колонка: {column.title}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            title="Закрыть"
            style={{
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
            }}
          >
            <X size={18} />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            onCreateCard(e, column.id, column.cards.length);
            onClose();
          }}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          <Input
            type="text"
            placeholder="Название карточки"
            value={cardForm.title || ""}
            onChange={(e) =>
              onCardFormChange(column.id, "title", e.target.value)
            }
          />

          <textarea
            placeholder="Описание"
            value={cardForm.description || ""}
            onChange={(e) =>
              onCardFormChange(column.id, "description", e.target.value)
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
            value={cardForm.dueDate || ""}
            onChange={(e) =>
              onCardFormChange(column.id, "dueDate", e.target.value)
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
              marginTop: "4px",
            }}
          >
            <Button type="submit">Создать карточку</Button>
            <Button type="button" variant="secondary" onClick={onClose}>
              Закрыть
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateCardModal;