interface ToastProps {
  message: string;
  type?: "error" | "success";
  onClose?: () => void;
}

export const Toast = ({ message, type = "error", onClose }: ToastProps) => {
  return (
    <div className={`toast toast--${type}`}>
      <span>{message}</span>
      {onClose && (
        <button className="toast__close" onClick={onClose}>
          ×
        </button>
      )}
    </div>
  );
};
