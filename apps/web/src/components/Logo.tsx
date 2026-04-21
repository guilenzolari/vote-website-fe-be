import logoImage from "./../assets/the-game-logo.png";

interface LogoProps {
  isPortrait: boolean;
}

export const Logo = ({ isPortrait }: LogoProps) => {
  const circleSize = isPortrait ? "13vh" : "13vw";
  const logoSize = isPortrait ? "10vh" : "8svw";

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
