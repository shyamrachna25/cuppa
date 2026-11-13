import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { METHODS } from "../constants/brewMethods.js";
import CupRating from "./CupRating.jsx";

const BLANK = {
  beanName: "",
  origin: "",
  method: "Pour Over",
  grindSize: "",
  ratio: "",
  brewTime: "",
  waterTemp: "",
  rating: 3,
  notes: "",
  date: new Date().toISOString().slice(0, 10),
};

export default function BrewForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || BLANK);
  const [error, setError] = useState("");

  useEffect(() => {
    setForm(initial || BLANK);
  }, [initial]);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await onSave({ ...form, rating: Number(form.rating) });
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form className="brew-form" onSubmit={handleSubmit}>
      <h2>{initial ? "Edit brew" : "Log a brew"}</h2>

      <label htmlFor="beanName">Bean / roaster</label>
      <input
        id="beanName"
        value={form.beanName}
        onChange={(e) => update("beanName", e.target.value)}
        required
      />

      <label htmlFor="origin">Origin (optional)</label>
      <input id="origin" value={form.origin} onChange={(e) => update("origin", e.target.value)} />

      <label htmlFor="method">Method</label>
      <select id="method" value={form.method} onChange={(e) => update("method", e.target.value)}>
        {METHODS.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>

      <div className="brew-form__row">
        <div>
          <label htmlFor="grindSize">Grind size</label>
          <input
            id="grindSize"
            value={form.grindSize}
            onChange={(e) => update("grindSize", e.target.value)}
            placeholder="Medium-fine"
          />
        </div>
        <div>
          <label htmlFor="ratio">Ratio</label>
          <input
            id="ratio"
            value={form.ratio}
            onChange={(e) => update("ratio", e.target.value)}
            placeholder="1:16"
          />
        </div>
      </div>

      <div className="brew-form__row">
        <div>
          <label htmlFor="brewTime">Brew time</label>
          <input
            id="brewTime"
            value={form.brewTime}
            onChange={(e) => update("brewTime", e.target.value)}
            placeholder="3:30"
          />
        </div>
        <div>
          <label htmlFor="waterTemp">Water temp (&deg;)</label>
          <input
            id="waterTemp"
            type="number"
            value={form.waterTemp}
            onChange={(e) => update("waterTemp", e.target.value)}
          />
        </div>
      </div>

      <span className="brew-form__label">Rating</span>
      <CupRating rating={Number(form.rating)} onRate={(n) => update("rating", n)} />

      <label htmlFor="date">Date</label>
      <input
        id="date"
        type="date"
        value={form.date?.slice(0, 10)}
        onChange={(e) => update("date", e.target.value)}
        required
      />

      <label htmlFor="notes">Tasting notes</label>
      <textarea
        id="notes"
        value={form.notes}
        onChange={(e) => update("notes", e.target.value)}
        rows={3}
      />

      {error && (
        <p className="brew-form__error" role="status">
          {error}
        </p>
      )}

      <div className="brew-form__buttons">
        <button type="submit">{initial ? "Save changes" : "Log brew"}</button>
        {onCancel && (
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

BrewForm.propTypes = {
  initial: PropTypes.object,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
};
