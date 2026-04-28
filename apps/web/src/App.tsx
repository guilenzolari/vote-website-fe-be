import "./App.css";
import { VoteButton } from "./components/VoteButton.tsx";
import { useState, useEffect } from "react";
import { Header } from "./components/Header.tsx";
import { SponsorsFooter } from "./components/SponsorsFooter.tsx";
import interfaceData from "./assets/interface.json";
import BiaRosa from "./assets/photos/BiaRosa.jpeg";
import Dinho from "./assets/photos/Dinho.jpeg";
import Madu from "./assets/photos/Madu.jpeg";

type Candidate = {
  id: string;
  name: string;
  image: string;
};

const candidates: Array<Candidate> = [
  {
    id: "bia-rosa",
    name: "Dinho",
    image: Dinho,
  },
  {
    id: "dinho",
    name: "Bia Rosa",
    image: BiaRosa,
  },
  {
    id: "madu",
    name: "Madu",
    image: Madu,
  },
];

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

  const gridWidth = 60;
  const gridHeight = 40;

  const gap = 2;

  const buttonHeight = isPortrait
    ? (gridHeight - gap * (candidates.length - 1)) / candidates.length
    : gridHeight;
  const buttonWidth = isPortrait
    ? gridWidth
    : (gridWidth - gap * (candidates.length - 1)) / candidates.length;

  const ButtonsList = (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: isPortrait ? `${gap}vh` : `${gap}vw`,
      }}
    >
      {candidates.map((candidate) => (
        <VoteButton
          key={candidate.id}
          label={candidate.name}
          onVote={() => alert(`You voted for ${candidate.name}!`)}
          isPortrait={isPortrait}
          height={buttonHeight}
          width={buttonWidth}
          imageUrl={candidate.image}
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
