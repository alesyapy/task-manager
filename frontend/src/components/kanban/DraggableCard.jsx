import { useDraggable, useDroppable } from "@dnd-kit/react";
import { Trash2, GripVertical } from "lucide-react";

function DraggableCard({ card, onDeleteCard, onOpenModal }) {
  const { ref: dragRef, handleRef, isDragging } = useDraggable({
    id: card.id,
  });

  const { ref: topDropRef, isDropTarget: isTopDropTarget } = useDroppable({
    id: `card-top-${card.id}`,
  });

  const { ref: bottomDropRef, isDropTarget: isBottomDropTarget } = useDroppable({
    id: `card-bottom-${card.id}`,
  });

  return (
    <div
      ref={dragRef}
      onClick={() => onOpenModal(card)}
      style={{
        background: "rgba(255,255,255,0.72)",
        border: "1px solid rgba(255,255,255,0.7)",
        borderRadius: "20px",
        padding: "16px",
        boxShadow: isDragging
          ? "0 16px 28px rgba(77,159,230,0.18)"
          : "0 8px 20px rgba(110,160,210,0.10)",
        backdropFilter: "blur(10px)",
        opacity: isDragging ? 0.85 : 1,
        transform: isDragging ? "scale(1.02)" : "scale(1)",
        transition: "0.2s ease",
        position: "relative",
        cursor: "pointer",
      }}
    >
      <div
        ref={topDropRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "50%",
          borderTop: isTopDropTarget
            ? "3px solid var(--color-primary-strong)"
            : "3px solid transparent",
          borderRadius: "20px 20px 0 0",
        }}
      />

      <div
        ref={bottomDropRef}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "50%",
          borderBottom: isBottomDropTarget
            ? "3px solid var(--color-primary-strong)"
            : "3px solid transparent",
          borderRadius: "0 0 20px 20px",
        }}
      />

      <div style={{ position: "relative", zIndex: 2 }}>
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
            onClick={(e) => e.stopPropagation()}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 10px",
              borderRadius: "999px",
              background: "rgba(124,194,246,0.18)",
              color: "var(--color-primary-strong)",
              fontSize: "12px",
              fontWeight: "700",
              cursor: "grab",
            }}
            title="Перетащить карточку"
          >
            <GripVertical size={15} />
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteCard(card.id);
            }}
            title="Удалить"
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
              marginTop: "10px",
              padding: "8px 10px",
              borderRadius: "14px",
              background: "rgba(124,194,246,0.14)",
              color: "var(--color-primary-strong)",
              fontSize: "13px",
              fontWeight: "600",
            }}
          >
            Изображений: {card.images.length}
          </div>
        )}
      </div>
    </div>
  );
}

export default DraggableCard;