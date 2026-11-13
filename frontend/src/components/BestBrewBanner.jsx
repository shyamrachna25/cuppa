import React from "react";
import PropTypes from "prop-types";
import CupRating from "./CupRating.jsx";

export default function BestBrewBanner({ brew }) {
  if (!brew) {
    return (
      <section className="best-brew best-brew--empty">
        <p>Log your first brew to see it featured here.</p>
      </section>
    );
  }

  return (
    <section className="best-brew">
      <p className="best-brew__label">Your best brew</p>
      <h2>{brew.beanName}</h2>
      {brew.origin && <p className="best-brew__origin">{brew.origin}</p>}
      <CupRating rating={brew.rating} />
      {brew.notes && <p className="best-brew__notes">&ldquo;{brew.notes}&rdquo;</p>}
    </section>
  );
}

BestBrewBanner.propTypes = {
  brew: PropTypes.shape({
    beanName: PropTypes.string.isRequired,
    origin: PropTypes.string,
    rating: PropTypes.number.isRequired,
    notes: PropTypes.string,
  }),
};
