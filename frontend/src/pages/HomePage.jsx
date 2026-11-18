import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import BestBrewBanner from "../components/BestBrewBanner.jsx";
import "./HomePage.css";

export default function HomePage() {
  const { user } = useAuth();
  const [bestBrew, setBestBrew] = useState(null);

  useEffect(() => {
    if (!user) return;
    fetch("/api/brews/best")
      .then((res) => (res.ok ? res.json() : null))
      .then(setBestBrew);
  }, [user]);

  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="home-hero__content">
          <h1>Brew it. Rate it. Find your next bag.</h1>
          <p className="home-hero__tagline">
            Cuppa is where your own brew log meets everyone else&rsquo;s honest reviews.
          </p>
        </div>
        <div className="home-hero__image-wrap">
          <img
            src="/hero-coffee.jpg"
            alt="A ceramic coffee cup, coffee beans, brewing equipment, and a notebook"
          />
        </div>
      </section>

      {user ? (
        <section className="home-page__personal">
          <h2 className="home-page__section-label">Your best cup so far</h2>
          <BestBrewBanner brew={bestBrew} />
        </section>
      ) : (
        <section className="home-cta">
          <p>Log in or create an account to start tracking your own brews.</p>
          <div className="home-cta__buttons">
            <Link to="/login" className="btn">
              Log in
            </Link>
            <Link to="/register" className="btn">
              Register
            </Link>
          </div>
        </section>
      )}

      <section className="home-menu">
        <article className="home-menu__item">
          <svg
            className="home-menu__icon"
            width="40"
            height="40"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              d="M14 8h20l-5 11h-10z"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <path
              d="M15 19h18v14a9 9 0 0 1-9 9 9 9 0 0 1-9-9z"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <path
              d="M33 23h3a4 4 0 0 1 0 8h-3"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <h3>My Brews</h3>
          <p>
            A private log of every cup you&rsquo;ve made: method, ratio, rating, and tasting notes,
            all in one place.
          </p>
          <Link to="/brews" className="btn">
            Open my log
          </Link>
        </article>

        <article className="home-menu__item home-menu__item--tasting">
          <svg
            className="home-menu__icon"
            width="40"
            height="40"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              d="M15 12h14l3 8v20a2 2 0 0 1-2 2H14a2 2 0 0 1-2-2V20z"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <path
              d="M15 12l3-6h12l3 6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <ellipse
              cx="20"
              cy="34"
              rx="4"
              ry="2.6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              transform="rotate(-15 20 34)"
            />
            <ellipse
              cx="28"
              cy="38"
              rx="4"
              ry="2.6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              transform="rotate(10 28 38)"
            />
          </svg>
          <h3>Tasting Board</h3>
          <p>
            Browse what other home brewers think of the beans they&rsquo;ve tried, before you buy
            your next bag.
          </p>
          <Link to="/tastings" className="btn">
            Browse reviews
          </Link>
        </article>
      </section>
    </div>
  );
}

HomePage.propTypes = {};
