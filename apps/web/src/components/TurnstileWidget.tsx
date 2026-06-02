import { useState, useEffect } from "react";
import { Turnstile } from "@marsidev/react-turnstile";
import interfaceData from "../assets/interface.json";

interface TurnstileWidgetProps {
  onTokenChange: (token: string | null) => void;
  onError?: (error: string) => void;
}

const TurnstileWidget = ({ onTokenChange, onError }: TurnstileWidgetProps) => {
  const { turnstileWidget } = interfaceData;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;

  useEffect(() => {
    if (!siteKey) {
      const errorMsg = turnstileWidget.siteKeyMissing;
      setError(errorMsg);
      onError?.(errorMsg);
    }
  }, [siteKey, onError, turnstileWidget.siteKeyMissing]);

  const handleOnLoad = () => {
    setIsLoading(false);
  };
  const handleOnVerify = (token: string) => {
    setError(null);
    onTokenChange(token);
  };

  const handleOnExpire = () => {
    onTokenChange(null);
    const errorMsg = turnstileWidget.tokenExpired;
    setError(errorMsg);
    onError?.(errorMsg);
  };

  const handleOnError = () => {
    const errorMsg = turnstileWidget.error;
    setError(errorMsg);
    onError?.(errorMsg);
  };

  const handleBeforeInteractive = () => {
    setIsLoading(true);
  };

  if (!siteKey) {
    return (
      <div className="turnstile-error">
        <p>{turnstileWidget.securityNotConfigured}</p>
      </div>
    );
  }

  return (
    <div className="turnstile-container">
      <Turnstile
        siteKey={siteKey}
        onLoad={handleOnLoad}
        onSuccess={handleOnVerify}
        onExpire={handleOnExpire}
        onError={handleOnError}
        onBeforeInteractive={handleBeforeInteractive}
      />

      {isLoading && (
        <div className="turnstile-loading">
          <p>{turnstileWidget.loading}</p>
        </div>
      )}
    </div>
  );
};

export default TurnstileWidget;
