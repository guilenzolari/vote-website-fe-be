export const SponsorsFooter = () => {
  return (
    <footer
      style={{
        width: "100%",
        backgroundColor: "var(--code-bg)",
        padding: "40px 0",
        borderTop: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px",
        boxSizing: "border-box",
        marginTop: "auto",
      }}
    >
      <p style={{ fontSize: "14px", fontWeight: "bold", margin: 0 }}>
        Nossos Patrocinadores
      </p>

      <div style={{ display: "flex", gap: "30px", opacity: 0.7 }}>
        <span>Patro 1</span>
        <span>Patroc 2</span>
        <span>Patroc 3</span>
      </div>
    </footer>
  );
};
