export default function Input({
  type = "text",
  placeholder = "",
  value,
  onChange,
  name,
}) {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      style={{
        width: "100%",
        padding: "12px 14px",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius)",
        fontSize: "14px",
        outline: "none",
        background: "var(--color-surface)",
      }}
    />
  );
}