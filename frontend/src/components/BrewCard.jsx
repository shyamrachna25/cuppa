import React from "react";
import PropTypes from "prop-types";
import CupRating from "./CupRating.jsx";
import { METHOD_COLORS } from "../constants/brewMethods.js";
import { EditIcon, TrashIcon } from "./ActionIcons.jsx";
import { formatRelativeTime } from "../utils/formatRelativeTime.js";
import "./BrewCard.css";

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

        {/* REVIEW: brew.date is a date-only string ("2026-11-18"), which new Date() reads as
            UTC midnight. In US time zones that is the previous evening, so a brew logged today
            shows "22 hours ago". Show the date itself (or Today/Yesterday/N days ago), and parse
            it as a local date, e.g. new Date(year, month - 1, day). */}
        <p className="brew-card__date">{formatRelativeTime(brew.date)}</p>
      </div>

      <div className="brew-card__side">
        <CupRating rating={brew.rating} />
        <div className="brew-card__actions">
          <button type="button" aria-label="Edit brew" onClick={() => onEdit(brew)}>
            <EditIcon />
          </button>
          <button type="button" aria-label="Delete brew" onClick={() => onDelete(brew._id)}>
            <TrashIcon />
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
