import "./App.css";
import { VoteButton } from "./components/VoteButton.tsx";
import { useState, useEffect } from "react";
import { Header } from "./components/Header.tsx";
import { SponsorsFooter } from "./components/SponsorsFooter.tsx";

const label: Array<string> = ["Pedro", "Maria", "João"];

function App() {
  const [isPortrait, setIsPortrait] = useState(
    window.innerHeight >= window.innerWidth,
  );

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

  return (
    <div id="center">
      <Header />
      <main
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        {ButtonsList}
      </main>
      <SponsorsFooter />
    </div>
  );
}

export default App;
