import React from "react";
import PropTypes from "prop-types";
import CupRating from "./CupRating.jsx";
import { EditIcon, TrashIcon } from "./ActionIcons.jsx";
import { formatRelativeTime } from "../utils/formatRelativeTime.js";
import "./TastingCard.css";

export default function TastingCard({ tasting, average, isOwner, onEdit, onDelete }) {
  return (
    <article className="tasting-card">
      <div className="tasting-card__main">
        <div className="tasting-card__heading">
          <h3>{tasting.coffeeName}</h3>
          <span className="tasting-card__roaster">{tasting.roaster}</span>
        </div>

        {tasting.origin && <p className="tasting-card__origin">{tasting.origin}</p>}

        {tasting.notes && <p className="tasting-card__notes">{tasting.notes}</p>}

        <p className="tasting-card__meta">
          Reviewed by {tasting.username}, {formatRelativeTime(tasting.createdAt)}
        </p>
      </div>

      <div className="tasting-card__side">
        {/* REVIEW: Love this. Coffee cups instead of generic stars are a creative touch
            that fits the theme, and showing the average and review count right next to
            the cups makes each review easy to judge at a glance. */}
        <CupRating rating={tasting.rating} />
        {average && (
          <p className="tasting-card__average">
            Average {average.average.toFixed(1)} from {average.count}{" "}
            {average.count === 1 ? "review" : "reviews"}
          </p>
        )}
        {isOwner && (
          <div className="tasting-card__actions">
            <button type="button" aria-label="Edit review" onClick={() => onEdit(tasting)}>
              <EditIcon />
            </button>
            <button type="button" aria-label="Delete review" onClick={() => onDelete(tasting._id)}>
              <TrashIcon />
            </button>
          </div>
        )}
      </div>
    </article>
  );
}

TastingCard.propTypes = {
  tasting: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    coffeeName: PropTypes.string.isRequired,
    roaster: PropTypes.string.isRequired,
    origin: PropTypes.string,
    rating: PropTypes.number.isRequired,
    notes: PropTypes.string,
    username: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
  }).isRequired,
  average: PropTypes.shape({
    average: PropTypes.number.isRequired,
    count: PropTypes.number.isRequired,
  }),
  isOwner: PropTypes.bool.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
