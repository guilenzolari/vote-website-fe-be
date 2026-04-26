import "./App.css";
import { VoteButton } from "./components/VoteButton.tsx";
import { useState, useEffect } from "react";
import { Header } from "./components/Header.tsx";
import { SponsorsFooter } from "./components/SponsorsFooter.tsx";
import interfaceData from "./assets/interface.json";

const label: Array<string> = ["Pedro", "Maria", "João"];

function App() {
  const [isPortrait, setIsPortrait] = useState(
    window.innerHeight >= window.innerWidth,
  );

  const { homepage } = interfaceData;

  useEffect(() => {
    const handleResize = () => {
      setIsPortrait(window.innerHeight >= window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const columns = isPortrait ? 1 : 3;

  const gridWidth = isPortrait ? 50 : 70;
  const gridHeight = isPortrait ? 40 : 25;

  const gap = 2;

  const buttonHeight = isPortrait
    ? (gridHeight - gap * (label.length - 1)) / label.length
    : gridHeight;
  const buttonWidth = isPortrait
    ? gridWidth
    : (gridWidth - gap * (label.length - 1)) / label.length;

  const ButtonsList = (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: isPortrait ? `${gap}vh` : `${gap}vw`,
        width: `${gridWidth}vw`,
        height: `${gridHeight}vh`,
      }}
    >
      {label.map((candidate) => (
        <VoteButton
          key={candidate}
          label={candidate}
          onVote={() => alert(`You voted for ${candidate}!`)}
          isPortrait={isPortrait}
          height={buttonHeight}
          width={buttonWidth}
          imageUrl={`https://images.unsplash.com/photo-1770010314670-464a6d221858?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`}
        />
      ))}
    </div>
  );

  const titleText = (
    <div>
      <h1 style={{ lineHeight: "1.2", fontSize: "32px", margin: "0 10px 8px" }}>
        {homepage.title}
      </h1>
      <h3>{homepage.description}</h3>
    </div>
  );

  return (
    <div id="center">
      <Header />
      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          gap: "40px",
          paddingBottom: "40px",
        }}
      >
        {titleText}
        {ButtonsList}
      </main>
      <SponsorsFooter />
    </div>
  );
}

export default App;
