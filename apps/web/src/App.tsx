import "./App.css";
import { VoteButton } from "./components/VoteButton.tsx";
import { useState, useEffect } from "react";
import { Logo } from "./components/Logo.tsx";

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
      <Logo isPortrait={isPortrait} />
      {ButtonsList}
    </div>
  );
}

export default App;
