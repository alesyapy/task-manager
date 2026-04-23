export default function PageContainer({ children, style = {} }) {
  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "32px 20px",
        ...style,
      }}
    >
      {children}
    </div>
  );
}