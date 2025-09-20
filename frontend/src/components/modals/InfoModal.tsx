import React from "react";
import { X } from "lucide-react";

type InfoModalProps = {
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
};

const InfoModal: React.FC<InfoModalProps> = ({ onClose, children, title }) => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.35)",
        zIndex: 10000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
      onClick={onClose}
    >
      <div
        className="card shadow rounded-xxl p-3 bg-white"
        style={{ maxWidth: "520px", width: "100%", position: "relative" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "0.5rem",
            right: "0.5rem",
            background: "none",
            border: "none",
          }}
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
        {title && <h5 className="fw-bold mb-3">{title}</h5>}
        {children}
      </div>
    </div>
  );
};

export default InfoModal;
