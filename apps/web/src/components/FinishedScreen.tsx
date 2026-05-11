import interfaceData from "../assets/interface.json";

interface FinishedScreenProps {
  endAt: number;
}

export const FinishedScreen = ({ endAt }: FinishedScreenProps) => {
  const endDate = new Date(endAt);
  const formattedDate = endDate.toLocaleString("pt-BR");
  const { finishedScreen } = interfaceData;

  return (
    <div className="voting-screen finished-screen">
      <div className="screen-content">
        <h1 className="screen-title">{finishedScreen.title}</h1>
        <p className="screen-description">{finishedScreen.description}</p>
        <p className="screen-info">
          {finishedScreen.votationFinishedIn} {formattedDate}
        </p>
        <p className="screen-result">{finishedScreen.info}</p>
      </div>
    </div>
  );
};
