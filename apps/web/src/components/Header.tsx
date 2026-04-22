import logoImage from "./../assets/the-game-logo.png";

export const Header = () => {
  const circleSize = "5vh";
  const logoSize = "4vh";

  return (
    <header
      style={{
        width: "100%",
        position: "sticky",
        top: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "12px 0",
        borderBottom: "1px solid rgba(255,255,255,0.12)",
        boxSizing: "border-box",
        zIndex: 10,
        backgroundColor: "var(--code-bg)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "90%",
        }}
      >
        <span
          style={{
            flex: 1,
            textAlign: "left",
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: "bold",
            letterSpacing: "-0.5px",
            fontSize: "24px",
          }}
        >
          the game
        </span>
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "50%",
            width: circleSize,
            height: circleSize,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "var(--shadow)",
          }}
        >
          <a
            href="https://www.instagram.com/rinhadereps"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={logoImage} style={{ width: logoSize }} alt="Logo" />
          </a>
        </div>
        <span
          style={{
            flex: 1,
            textAlign: "right",
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: "bold",
            letterSpacing: "-0.5px",
            fontSize: "24px",
            color: "var(--accent)",
          }}
        >
          Rinha de Reps
        </span>
      </div>
    </header>
  );
};
