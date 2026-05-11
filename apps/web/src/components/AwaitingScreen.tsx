import { Countdown } from "./Countdown";
import interfaceData from "../assets/interface.json";

interface AwaitingScreenProps {
  startAt: number;
  onComplete?: () => void;
}

export const AwaitingScreen = ({
  startAt,
  onComplete,
}: AwaitingScreenProps) => {
  const { awaitingScreen } = interfaceData;

  return (
    <div className="voting-screen awaiting-screen">
      <div className="screen-content">
        <h1 className="screen-title">{awaitingScreen.title}</h1>
        <p className="screen-description">{awaitingScreen.description}</p>
        <Countdown targetTime={startAt} onComplete={onComplete} />
        <p className="screen-info">{awaitingScreen.info}</p>
      </div>
    </div>
  );
};
