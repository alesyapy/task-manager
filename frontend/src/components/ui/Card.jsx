export default function Card({ children, style = {} }) {
  return (
    <div
      style={{
        background: "var(--color-surface)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderRadius: "24px",
        boxShadow: "var(--shadow)",
        border: "1px solid rgba(255, 255, 255, 0.65)",
        padding: "28px",
        ...style,
      }}
    >
      {children}
    </div>
  );
}