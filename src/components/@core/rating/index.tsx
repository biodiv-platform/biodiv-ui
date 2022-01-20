import React, { useState } from "react";

interface RatingProps {
  readonly?;
  initialRating?;
  onChange;
  emptySymbol?;
  fullSymbol?;
}

export const Rating = ({
  readonly,
  initialRating,
  onChange,
  emptySymbol,
  fullSymbol
}: RatingProps) => {
  const [currentRating, setCurrentRating] = useState(initialRating || 0);
  const [hoverRating, setHoverRating] = useState();

  const handleClick = (newRating) => {
    setCurrentRating(newRating);
    onChange(newRating);
  };

  const handleMouseOver = (value) => {
    if (readonly) return;
    if (value) setHoverRating(value);
  };

  const handleMouseOut = () => setHoverRating(undefined);

  return (
    <div
      className="hcr-rater"
      onMouseOut={handleMouseOut}
      style={{ cursor: readonly ? "default" : "pointer" }}
    >
      {new Array(5).fill(0).map((_, idx) => (
        <Star
          value={idx + 1}
          key={idx}
          rating={hoverRating || currentRating}
          onClick={handleClick}
          onMouseOver={handleMouseOver}
          emptySymbol={emptySymbol}
          fullSymbol={fullSymbol}
        />
      ))}
    </div>
  );
};

const Star = ({ value, rating, emptySymbol, fullSymbol, onClick, onMouseOver }) => (
  <span
    className="hcr-star"
    data-value={value}
    onClick={() => onClick(value)}
    onMouseOver={() => onMouseOver(value)}
  >
    {value <= rating ? fullSymbol || "★" : emptySymbol || "☆"}
  </span>
);

export default Rating;
