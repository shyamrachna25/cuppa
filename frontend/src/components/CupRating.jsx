import React, { useState } from "react";
import PropTypes from "prop-types";

function Cup({ filled }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      className={filled ? "cup cup--filled" : "cup cup--empty"}
      aria-hidden="true"
    >
      <path d="M4 3h12v9a6 6 0 0 1-6 6 6 6 0 0 1-6-6V3z" />
      <path
        d="M16 6h2a3 3 0 0 1 0 6h-2"
        fill="none"
        strokeWidth="1.6"
        stroke="currentColor"
      />
    </svg>
  );
}

Cup.propTypes = {
  filled: PropTypes.bool.isRequired,
};

// Same visual (coffee cups instead of stars) in two modes:
// - display mode (default): read-only, used on BrewCard / BestBrewBanner
// - interactive mode (onRate passed in): used by BrewForm as the actual
//   rating control, with hover preview and click-to-set.
export default function CupRating({ rating, onRate }) {
  const [hoverValue, setHoverValue] = useState(0);
  const interactive = typeof onRate === "function";
  const displayValue = interactive && hoverValue > 0 ? hoverValue : rating;

  if (!interactive) {
    return (
      <span className="cup-rating" role="img" aria-label={`${rating} out of 5`}>
        {[1, 2, 3, 4, 5].map((n) => (
          <Cup key={n} filled={n <= rating} />
        ))}
      </span>
    );
  }

  return (
    <span className="cup-rating cup-rating--interactive" role="group" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          className="cup-rating__button"
          aria-label={`Rate ${n} out of 5`}
          aria-pressed={n === rating}
          onMouseEnter={() => setHoverValue(n)}
          onMouseLeave={() => setHoverValue(0)}
          onFocus={() => setHoverValue(n)}
          onBlur={() => setHoverValue(0)}
          onClick={() => onRate(n)}
        >
          <Cup filled={n <= displayValue} />
        </button>
      ))}
    </span>
  );
}

CupRating.propTypes = {
  rating: PropTypes.number.isRequired,
  onRate: PropTypes.func,
};
