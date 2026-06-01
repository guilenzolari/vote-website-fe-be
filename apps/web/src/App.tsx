import "./App.css";
import Vote from "./views/Vote.tsx";
import ErrorBoundary from "./views/ErrorBoundary.tsx";

function App() {
  return (
    <ErrorBoundary>
      <Vote />
    </ErrorBoundary>
  );
}

export default App;
