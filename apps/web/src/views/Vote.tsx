import { VoteButton } from "../components/VoteButton.tsx";
import TurnstileWidget from "../components/TurnstileWidget.tsx";
import { useState, useEffect, useRef } from "react";
import { Header } from "../components/Header.tsx";
import { SponsorsFooter } from "../components/SponsorsFooter.tsx";
import { AwaitingScreen } from "../components/AwaitingScreen.tsx";
import { FinishedScreen } from "../components/FinishedScreen.tsx";
import { SuccessScreen } from "../components/SuccessScreen.tsx";
import { Toast } from "../components/Toast";
import interfaceData from "../assets/interface.json";
import { useVotationStatus } from "../hooks/useVotationStatus";
import type { ApiError } from "@vote-website/shared";
import { VotingStatus } from "@vote-website/shared";
import { postVote } from "../services/api";
import { mapApiErrorMessage } from "../utils/mapApiErrorMessage.tsx";

const Vote = () => {
  const { homepage, voteScreen } = interfaceData;

  const [isPortrait, setIsPortrait] = useState(
    window.innerHeight >= window.innerWidth,
  );
  const [votedFor, setVotedFor] = useState<string | null>(null);
  const [isVoting, setIsVoting] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileError, setTurnstileError] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "error" | "success";
  } | null>(null);
  const toastTimeoutRef = useRef<number | null>(null);

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

  const clearToast = () => {
    if (toastTimeoutRef.current) {
      window.clearTimeout(toastTimeoutRef.current);
      toastTimeoutRef.current = null;
    }
    setToast(null);
  };

  const showToast = (message: string, type: "error" | "success" = "error") => {
    clearToast();
    setToast({ message, type });
    toastTimeoutRef.current = window.setTimeout(() => {
      setToast(null);
      toastTimeoutRef.current = null;
    }, 5000);
  };

  const isApiError = (value: unknown): value is ApiError => {
    return (
      typeof value === "object" &&
      value !== null &&
      "code" in value &&
      typeof (value as any).code === "string"
    );
  };

  const isExpirationError = (error: unknown): boolean => {
    if (error instanceof Error) {
      return (
        error.message.includes("InvalidCaptchaError") ||
        error.message.includes("403") ||
        error.message.includes("Invalid captcha")
      );
    }

    if (typeof error === "object" && error !== null) {
      const errObj = error as Record<string, unknown>;
      const statusCode = errObj.statusCode as number | undefined;
      const code = String(errObj.code || "");
      const message = String(errObj.message || "");

      return (
        statusCode === 403 ||
        code === "INVALID_CAPTCHA" ||
        message.includes("InvalidCaptchaError") ||
        message.includes("Invalid captcha")
      );
    }

    return false;
  };

  const handleTurnstileTokenChange = (token: string | null) => {
    setTurnstileToken(token);
    setTurnstileError(null);
  };

  const handleTurnstileError = (error: string) => {
    setTurnstileError(turnstileError);
    showToast(error, "error");
  };

  const resetTurnstile = () => {
    setTurnstileToken(null);
    setTurnstileError(null);
  };

  const handleVote = async (candidateId: string, candidateName: string) => {
    if (!turnstileToken) {
      showToast(voteScreen.missingCaptcha, "error");
      return;
    }

    setIsVoting(true);

    try {
      await postVote({
        optionId: candidateId,
        captchaToken: turnstileToken,
      });

      setVotedFor(candidateName);
      resetTurnstile();
    } catch (err) {
      if (isExpirationError(err)) {
        resetTurnstile();
        showToast(voteScreen.verificationExpired, "error");
      } else if (isApiError(err)) {
        showToast(mapApiErrorMessage(err), "error");
      } else {
        const message =
          err instanceof Error ? err.message : voteScreen.voteRegistrationError;
        showToast(mapApiErrorMessage(message), "error");
      }
    } finally {
      setIsVoting(false);
    }
  };

  const handleVoteAgain = () => {
    setVotedFor(null);
    setTurnstileToken(null);
    setTurnstileError(null);
    clearToast();
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
          <p>{voteScreen.loadingConfiguration}</p>
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
          <p>{voteScreen.loadError}</p>
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

        <section
          style={{
            width: "100%",
            maxWidth: "640px",
            marginBottom: "24px",
          }}
        >
          <TurnstileWidget
            onTokenChange={handleTurnstileTokenChange}
            onError={handleTurnstileError}
          />
        </section>

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
              disabled={isVoting || !turnstileToken}
            />
          ))}
        </div>
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
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={clearToast} />
      )}
      <SponsorsFooter />
    </div>
  );
};

export default Vote;
