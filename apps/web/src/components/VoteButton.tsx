interface VoteButtonProps {
  label: string;
  onVote: () => void;
  height?: number;
  width?: number;
}

export const VoteButton = ({ label, onVote }: VoteButtonProps) => {
  return (
    <button
      className="counter"
      onClick={onVote}
      style={{
        cursor: "pointer",
        opacity: 1,
        width: "100%",
        height: "100%",
        margin: 0,
      }}
    >
      {label}
    </button>
  );
};
