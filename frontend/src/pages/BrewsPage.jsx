import React, { useState, useEffect, useCallback } from "react";
import BestBrewBanner from "../components/BestBrewBanner.jsx";
import BrewFilterBar from "../components/BrewFilterBar.jsx";
import BrewCard from "../components/BrewCard.jsx";
import BrewForm from "../components/BrewForm.jsx";

export default function BrewsPage() {
  const [brews, setBrews] = useState([]);
  const [bestBrew, setBestBrew] = useState(null);
  const [filters, setFilters] = useState({ method: "", start: "", end: "" });
  const [editingBrew, setEditingBrew] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const loadBrews = useCallback(async () => {
    const params = new URLSearchParams();
    if (filters.method) params.set("method", filters.method);
    if (filters.start) params.set("start", filters.start);
    if (filters.end) params.set("end", filters.end);

    const res = await fetch(`/api/brews?${params.toString()}`);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.errors?.[0] || "Could not load your brews.");
    }
    const data = await res.json();
    setBrews(Array.isArray(data) ? data : []);
  }, [filters]);

  // Shared by the initial load, after saving, and after deleting — so the
  // Best Brew banner never goes stale after any change to the brew list.
  const loadBestBrew = useCallback(async () => {
    const res = await fetch("/api/brews/best");
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.errors?.[0] || "Could not load your best brew.");
    }
    const data = await res.json();
    setBestBrew(data);
  }, []);

  useEffect(() => {
    setLoading(true);
    setPageError("");
    Promise.all([loadBrews(), loadBestBrew()])
      .catch((err) => setPageError(err.message))
      .finally(() => setLoading(false));
  }, [loadBrews, loadBestBrew]);

  async function handleSave(data) {
    const url = editingBrew ? `/api/brews/${editingBrew._id}` : "/api/brews";
    const method = editingBrew ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.errors?.[0] || "Could not save brew.");

    setShowForm(false);
    setEditingBrew(null);
    setPageError("");
    try {
      await Promise.all([loadBrews(), loadBestBrew()]);
    } catch (err) {
      setPageError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this brew?")) return;
    setPageError("");

    try {
      const res = await fetch(`/api/brews/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.errors?.[0] || "Could not delete brew.");
      }
      // Refetch both — the brew that was just deleted might have been
      // the best-rated one, so the banner needs a fresh answer too.
      await Promise.all([loadBrews(), loadBestBrew()]);
    } catch (err) {
      setPageError(err.message);
    }
  }

  function handleEdit(brew) {
    setEditingBrew(brew);
    setShowForm(true);
  }

  return (
    <div className="brews-page">
      {pageError && (
        <p className="brews-page__error" role="status">
          {pageError}
        </p>
      )}

      <BestBrewBanner brew={bestBrew} />

      <div className="brews-page__toolbar">
        <BrewFilterBar filters={filters} onChange={setFilters} />
        <button
          type="button"
          onClick={() => {
            setEditingBrew(null);
            setShowForm(true);
          }}
        >
          Log a brew
        </button>
      </div>

      {showForm && (
        <BrewForm
          initial={editingBrew}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingBrew(null);
          }}
        />
      )}

      {loading ? (
        <p className="brews-page__loading">Loading your brews...</p>
      ) : brews.length === 0 ? (
        <p className="brews-page__empty">No brews logged yet — add your first one above.</p>
      ) : (
        <div className="brew-list">
          {brews.map((brew) => (
            <BrewCard key={brew._id} brew={brew} onEdit={handleEdit} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
