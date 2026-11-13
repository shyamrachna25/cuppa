import React from "react";
import PropTypes from "prop-types";
import { METHODS } from "../constants/brewMethods.js";

export default function BrewFilterBar({ filters, onChange }) {
  function update(field, value) {
    onChange({ ...filters, [field]: value });
  }

  return (
    <div className="brew-filter-bar">
      <label htmlFor="filter-method">Method</label>
      <select
        id="filter-method"
        value={filters.method}
        onChange={(e) => update("method", e.target.value)}
      >
        <option value="">All methods</option>
        {METHODS.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>

      <label htmlFor="filter-start">From</label>
      <input
        id="filter-start"
        type="date"
        value={filters.start}
        onChange={(e) => update("start", e.target.value)}
      />

      <label htmlFor="filter-end">To</label>
      <input
        id="filter-end"
        type="date"
        value={filters.end}
        onChange={(e) => update("end", e.target.value)}
      />
    </div>
  );
}

BrewFilterBar.propTypes = {
  filters: PropTypes.shape({
    method: PropTypes.string,
    start: PropTypes.string,
    end: PropTypes.string,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
};
