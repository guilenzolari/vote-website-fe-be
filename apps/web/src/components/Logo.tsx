import logoImage from "./../assets/the-game-logo.png";

export const Logo = () => {
  const circleSize = "13vw";
  const logoSize = "10vw";

  return (
    <div
      style={{
        backgroundColor: "#fff",
        borderRadius: "50%",
        width: circleSize,
        height: circleSize,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "10px",
        marginTop: "10px",
        boxShadow: "var(--shadow)",
      }}
    >
      <a
        href="https://www.instagram.com/rinhadereps"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src={logoImage} style={{ width: logoSize }} alt="Imagem " />
      </a>
    </div>
  );
};
