import { useState } from "react";
import { useDroppable } from "@dnd-kit/react";
import { Pencil, Trash2 } from "lucide-react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import CreateCardModal from "./CreateCardModal";

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

  const [showCreateCardModal, setShowCreateCardModal] = useState(false);

  return (
    <>
      <div
        ref={ref}
        style={{
          minWidth: "320px",
          maxWidth: "320px",
          background: isDropTarget
            ? "rgba(255,255,255,0.82)"
            : "rgba(255,255,255,0.68)",
          border: isDropTarget
            ? "1px solid rgba(77,159,230,0.45)"
            : "1px solid rgba(255,255,255,0.7)",
          borderRadius: "28px",
          padding: "18px",
          boxShadow: "0 12px 28px rgba(110,160,210,0.12)",
          backdropFilter: "blur(12px)",
          flexShrink: 0,
          transition: "0.2s ease",
        }}
      >
        {!editColumnForm ? (
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: "12px",
              marginBottom: "18px",
            }}
          >
            <div>
              <h3
                style={{
                  fontSize: "24px",
                  color: "var(--color-text)",
                  marginBottom: "4px",
                  wordBreak: "break-word",
                }}
              >
                {column.title}
              </h3>

              <p
                style={{
                  fontSize: "13px",
                  color: "var(--color-text-secondary)",
                }}
              >
                Карточек: {column.cards.length}
              </p>
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
                onClick={() => onStartEditColumn(column)}
                title="Редактировать колонку"
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "12px",
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
                <Pencil size={16} />
              </button>

              <button
                type="button"
                onClick={() => onDeleteColumn(column.id)}
                title="Удалить колонку"
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "12px",
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
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={(e) => onUpdateColumn(e, column.id)}
            style={{
              marginBottom: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <Input
              type="text"
              value={editColumnForm.title}
              onChange={(e) => onEditColumnChange(column.id, e.target.value)}
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
                onClick={() => onCancelEditColumn(column.id)}
              >
                Отмена
              </Button>
            </div>
          </form>
        )}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "14px",
            minHeight: "40px",
          }}
        >
          {children}
        </div>

        <div
          style={{
            marginTop: "18px",
            paddingTop: "14px",
            borderTop: "1px solid rgba(158, 196, 230, 0.25)",
          }}
        >
          <button
            type="button"
            onClick={() => setShowCreateCardModal(true)}
            title="Добавить карточку"
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "16px",
              border: "1px solid rgba(124,194,246,0.35)",
              background: "rgba(255,255,255,0.72)",
              color: "var(--color-primary-strong)",
              fontSize: "28px",
              fontWeight: "500",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 10px 20px rgba(110,160,210,0.10)",
              cursor: "pointer",
            }}
          >
            +
          </button>
        </div>
      </div>

      {showCreateCardModal && (
        <CreateCardModal
          column={column}
          cardForm={cardForm}
          onClose={() => setShowCreateCardModal(false)}
          onCardFormChange={onCardFormChange}
          onCreateCard={onCreateCard}
        />
      )}
    </>
  );
}

export default DroppableColumn;