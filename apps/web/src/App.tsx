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

  const gridWidth = isPortrait ? "50vw" : "70vw";
  const gridHeight = isPortrait ? "50vh" : "30vh";

  const ButtonsList = (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: "2vw",
        width: gridWidth,
        height: gridHeight,
      }}
    >
      {label.map((candidate) => (
        <VoteButton
          key={candidate}
          label={candidate}
          onVote={() => alert(`You voted for ${candidate}!`)}
        />
      ))}
    </div>
  );

  const titleText = (
    <div>
      <h1 style={{ lineHeight: "1.2", fontSize: "32px", margin: "0 0 8px" }}>
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
