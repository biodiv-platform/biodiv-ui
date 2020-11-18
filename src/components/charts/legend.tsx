import React from "react";

export default function Legend({ keys, colors }) {
  return (
    <div
      className="legend"
      style={{
        marginTop: "0.25rem",
        textAlign: "center",
        textTransform: "capitalize"
      }}
    >
      {keys.map((k, i) => (
        <small key={i}>
          <span style={{ color: colors[i] }}>&#9632;</span> {k}&emsp;
        </small>
      ))}
    </div>
  );
}
