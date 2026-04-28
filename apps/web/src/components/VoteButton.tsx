interface VoteButtonProps {
  label: string;
  onVote: () => void;
  height?: number;
  width?: number;
  isPortrait?: boolean;
  imageUrl?: string;
}

const getImageDimensions = (
  isPortrait?: boolean,
  width?: number,
  height?: number,
) => {
  const commonStyles = {
    flexShrink: 0,
    borderRadius: "5px",
    margin: 1,
    objectFit: "cover" as const,
  };
  if (isPortrait) {
    return {
      width: `${height}vh`,
      height: `${height}vh`,
      ...commonStyles,
    };
  }

  return {
    width: `${width}vw`,
    height: `${width}vw`,
    ...commonStyles,
  };
};

const text = (label: string) => {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        paddingTop: "10px",
      }}
    >
      <h2>{label}</h2>
    </div>
  );
};

export const VoteButton = ({
  label,
  onVote,
  isPortrait,
  imageUrl,
  width,
  height,
}: VoteButtonProps) => {
  return (
    <button
      className="counter"
      onClick={onVote}
      style={{
        cursor: "pointer",
        margin: 0,
        width: `${width}vw`,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: isPortrait ? "row" : "column",
          alignItems: "center",
          width: "100%",
          height: "100%",
          overflow: "hidden",
          flexShrink: 0,
          borderRadius: "5px",
        }}
      >
        {isPortrait && text(label)}
        {imageUrl && (
          <img
            src={imageUrl}
            alt={label}
            style={getImageDimensions(isPortrait, width, height)}
          />
        )}
        {!isPortrait && text(label)}
      </div>
    </button>
  );
};
