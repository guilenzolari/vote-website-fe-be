import logoImage from "./../assets/the-game-logo.png";
import interfaceData from "../assets/interface.json";

export const Header = () => {
  const circleSize = "5vh";
  const logoSize = "4vh";
  const { header } = interfaceData;

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
          className="header-text"
          style={{
            textAlign: "left",
          }}
        >
          {header.theGame}
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
          className="header-text"
          style={{
            textAlign: "right",
            color: "var(--accent)",
          }}
        >
          {header.rinhaDeReps}
        </span>
      </div>
    </header>
  );
};
