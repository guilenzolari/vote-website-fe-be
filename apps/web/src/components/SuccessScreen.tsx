interface SuccessScreenProps {
  optionName: string;
  onVoteAgain: () => void;
}

export const SuccessScreen = ({
  optionName,
  onVoteAgain,
}: SuccessScreenProps) => {
  return (
    <div className="voting-screen success-screen">
      <div className="screen-content">
        <h1 className="screen-title">✅ Voto Registrado!</h1>
        <p className="screen-description">Seu voto em</p>
        <p className="screen-option-name">{optionName}</p>
        <p className="screen-info">foi registrado com sucesso.</p>
      </div>
      <button
        className="vote-button vote-button--secondary"
        onClick={onVoteAgain}
      >
        Votar Novamente
      </button>
    </div>
  );
};
