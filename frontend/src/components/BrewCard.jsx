import React from "react";
import PropTypes from "prop-types";
import CupRating from "./CupRating.jsx";
import { METHOD_COLORS } from "../constants/brewMethods.js";

export default function BrewCard({ brew, onEdit, onDelete }) {
  const accentColor = METHOD_COLORS[brew.method] || METHOD_COLORS.Other;

  return (
    <article className="brew-card" style={{ borderLeftColor: accentColor }}>
      <div className="brew-card__main">
        <div className="brew-card__heading">
          <h3>{brew.beanName}</h3>
          <span className="brew-card__method" style={{ color: accentColor }}>
            {brew.method}
          </span>
        </div>

        <dl className="brew-card__details">
          {brew.ratio && (
            <>
              <dt>Ratio</dt>
              <dd>{brew.ratio}</dd>
            </>
          )}
          {brew.grindSize && (
            <>
              <dt>Grind</dt>
              <dd>{brew.grindSize}</dd>
            </>
          )}
          {brew.brewTime && (
            <>
              <dt>Time</dt>
              <dd>{brew.brewTime}</dd>
            </>
          )}
          {brew.waterTemp && (
            <>
              <dt>Water</dt>
              <dd>{brew.waterTemp}&deg;</dd>
            </>
          )}
        </dl>

        {brew.notes && <p className="brew-card__notes">{brew.notes}</p>}

        <p className="brew-card__date">
          {new Date(brew.date).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </p>
      </div>

      <div className="brew-card__side">
        <CupRating rating={brew.rating} />
        <div className="brew-card__actions">
          <button type="button" onClick={() => onEdit(brew)}>
            Edit
          </button>
          <button type="button" onClick={() => onDelete(brew._id)}>
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}

BrewCard.propTypes = {
  brew: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    beanName: PropTypes.string.isRequired,
    method: PropTypes.string.isRequired,
    ratio: PropTypes.string,
    grindSize: PropTypes.string,
    brewTime: PropTypes.string,
    waterTemp: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    notes: PropTypes.string,
    rating: PropTypes.number.isRequired,
    date: PropTypes.string.isRequired,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
