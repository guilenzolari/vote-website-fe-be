import { VoteButton } from "../components/VoteButton.tsx";
import { useState, useEffect } from "react";
import { Header } from "../components/Header.tsx";
import { SponsorsFooter } from "../components/SponsorsFooter.tsx";
import { AwaitingScreen } from "../components/AwaitingScreen.tsx";
import { FinishedScreen } from "../components/FinishedScreen.tsx";
import { SuccessScreen } from "../components/SuccessScreen.tsx";
import interfaceData from "../assets/interface.json";
import { useVotationStatus } from "../hooks/useVotationStatus";
import { VotingStatus } from "@vote-website/shared";
import { postVote } from "../services/api";

const Vote = () => {
  const { homepage } = interfaceData;

  const [isPortrait, setIsPortrait] = useState(
    window.innerHeight >= window.innerWidth,
  );
  const [votedFor, setVotedFor] = useState<string | null>(null);
  const [isVoting, setIsVoting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { votationConfig, loading, refetch } = useVotationStatus();
  const candidates = votationConfig?.options || [];

  const minHeight = "80vh";

  useEffect(() => {
    const handleResize = () => {
      setIsPortrait(window.innerHeight >= window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleVote = async (candidateId: string, candidateName: string) => {
    setIsVoting(true);
    setError(null);

    try {
      // TODO: Integrar com reCAPTCHA para obter captchaToken
      const captchaToken = "placeholder-captcha-token";

      await postVote({
        optionId: candidateId,
        captchaToken,
      });

      setVotedFor(candidateName);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao registrar voto");
    } finally {
      setIsVoting(false);
    }
  };

  const handleVoteAgain = () => {
    setVotedFor(null);
    setError(null);
  };

  if (loading) {
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
            paddingBottom: "40px",
            minHeight: minHeight,
          }}
        >
          <p>Carregando configuração de votação...</p>
        </main>
        <SponsorsFooter />
      </div>
    );
  }

  if (!votationConfig) {
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
            paddingBottom: "40px",
            minHeight: minHeight,
          }}
        >
          <p>Erro ao carregar configuração de votação</p>
        </main>
        <SponsorsFooter />
      </div>
    );
  }

  // Renderiza tela apropriada baseada no status de votação
  let screenContent;

  if (votedFor) {
    screenContent = (
      <SuccessScreen optionName={votedFor} onVoteAgain={handleVoteAgain} />
    );
  } else if (votationConfig.status === VotingStatus.UPCOMING) {
    screenContent = (
      <AwaitingScreen startAt={votationConfig.startAt} onComplete={refetch} />
    );
  } else if (votationConfig.status === VotingStatus.FINISHED) {
    screenContent = <FinishedScreen endAt={votationConfig.endAt} />;
  } else {
    // VotingStatus.ACTIVE
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

    screenContent = (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <div>
          <h1
            style={{
              lineHeight: "1.2",
              fontSize: "32px",
              margin: "0 10px 8px",
            }}
          >
            {homepage.title}
          </h1>
          <h3>{homepage.description}</h3>
        </div>
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
              onVote={() => handleVote(candidate.id, candidate.name)}
              isPortrait={isPortrait}
              height={buttonHeight}
              width={buttonWidth}
              imageUrl={candidate.image}
              disabled={isVoting}
            />
          ))}
        </div>
        {error && (
          <p style={{ color: "red", marginTop: "20px", textAlign: "center" }}>
            {error}
          </p>
        )}
      </div>
    );
  }

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
          paddingBottom: "40px",
          minHeight: minHeight,
        }}
      >
        {screenContent}
      </main>
      <SponsorsFooter />
    </div>
  );
};

export default Vote;
