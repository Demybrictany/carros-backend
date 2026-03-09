import React from "react";

const CrudButton = ({ text, color, onClick }) => {
  return (
    <button
      style={{
        backgroundColor: color || "#555",
        color: "white",
        padding: "8px 12px",
        margin: "4px",
        borderRadius: "6px",
        border: "none",
        cursor: "pointer",
      }}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default CrudButton;
