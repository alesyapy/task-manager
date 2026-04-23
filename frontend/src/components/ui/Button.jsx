export default function Button({
  children,
  onClick,
  variant = "primary",
  type = "button",
}) {
  const background =
    variant === "primary"
      ? "linear-gradient(135deg, #7cc2f6 0%, #4d9fe6 100%)"
      : variant === "danger"
      ? "var(--color-danger)"
      : "#ffffff";

  const color = variant === "secondary" ? "var(--color-text)" : "#ffffff";

  const border =
    variant === "secondary" ? "1px solid var(--color-border)" : "none";

  return (
    <button
      type={type}
      onClick={onClick}
      style={{
        padding: "13px 18px",
        borderRadius: "999px",
        background,
        color,
        border,
        fontSize: "15px",
        fontWeight: "600",
        boxShadow:
          variant === "primary"
            ? "0 10px 24px rgba(92, 166, 230, 0.28)"
            : "none",
        transition: "0.2s ease",
      }}
    >
      {children}
    </button>
  );
}