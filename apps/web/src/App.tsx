import "./App.css";
import { VoteButton } from "./components/VoteButton.tsx";

const label: Array<string> = [
  "Pedro",
  "Maria",
  "João",
  "Ana",
  "Carlos",
  "Sofia",
  "Lucas",
  "Isabela",
  "Gabriel",
];

function App() {
  const labelCount = label.length;
  const collumns = Math.floor(Math.sqrt(label.length));
  const rows = Math.ceil(labelCount / collumns);

  const gridWidth = "80vw";
  const gridHeight = "60vh";

  return (
    <div id="center">
      <h1>Vote for your favorite candidate!</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${collumns}, 1fr)`,
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
    </div>
  );
}

export default App;
