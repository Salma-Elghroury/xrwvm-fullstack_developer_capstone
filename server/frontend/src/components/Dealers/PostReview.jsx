import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import "./Dealers.css";
import "../assets/style.css";
import Header from '../Header/Header';

const PostReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dealer, setDealer] = useState(null);
  const [review, setReview] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [date, setDate] = useState("");
  const [carModels, setCarModels] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const isAuthenticated = Boolean(sessionStorage.getItem("username"));

  const getDealerAndCars = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [dealerResponse, carsResponse] = await Promise.all([
        fetch(`/djangoapp/dealer/${id}`),
        fetch("/djangoapp/get_cars"),
      ]);
      if (!dealerResponse.ok || !carsResponse.ok) {
        throw new Error("Unable to load the dealer or car information.");
      }

      const dealerResult = await dealerResponse.json();
      const carsResult = await carsResponse.json();
      if (dealerResult.status !== 200 || !Array.isArray(dealerResult.dealer) ||
          dealerResult.dealer.length === 0 || !Array.isArray(carsResult.CarModels)) {
        throw new Error("The server returned invalid dealer or car information.");
      }

      setDealer(dealerResult.dealer[0]);
      setCarModels(carsResult.CarModels);
    } catch (loadError) {
      console.error("Unable to load the review form.", loadError);
      setError("Unable to load this dealer's review form. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    getDealerAndCars();
  }, [getDealerAndCars]);

  const postReview = async (event) => {
    event.preventDefault();
    if (!isAuthenticated) {
      setError("Please log in before submitting a review.");
      return;
    }

    const selectedModel = carModels.find(
      (carModel) => `${carModel.CarMake}::${carModel.CarModel}` === model
    );
    if (!selectedModel) {
      setError("Choose the make and model of the car you purchased.");
      return;
    }

    setSubmitting(true);
    setError("");
    const storedName = `${sessionStorage.getItem("firstname") || ""} ${sessionStorage.getItem("lastname") || ""}`.trim();
    const name = storedName || sessionStorage.getItem("username");

    try {
      const response = await fetch("/djangoapp/add_review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          dealership: Number(id),
          review: review.trim(),
          purchase: true,
          purchase_date: date,
          car_make: selectedModel.CarMake,
          car_model: selectedModel.CarModel,
          car_year: Number(year),
        }),
      });
      const result = await response.json();
      if (!response.ok || result.status !== 200) {
        throw new Error(result.message || `Review submission failed (${response.status}).`);
      }
      navigate(`/dealer/${id}`, { replace: true });
    } catch (submitError) {
      console.error("Unable to submit the dealership review.", submitError);
      setError(submitError.message || "Unable to submit your review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Header />
      <main className="postreview_form">
        <h1>{dealer ? dealer.full_name : "Write a dealer review"}</h1>
        {!isAuthenticated ? (
          <p role="alert">Please <a href="/login">log in</a> to post a review.</p>
        ) : loading ? (
          <p>Loading review form...</p>
        ) : error && !dealer ? (
          <p role="alert">{error}</p>
        ) : (
          <form onSubmit={postReview}>
            <label htmlFor="review">Your review</label>
            <textarea
              id="review"
              name="review"
              rows="7"
              value={review}
              onChange={(event) => setReview(event.target.value)}
              required
            />

            <label htmlFor="purchase-date">Purchase date</label>
            <input
              id="purchase-date"
              name="purchase_date"
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              required
            />

            <label htmlFor="cars">Car make and model</label>
            <select
              id="cars"
              name="cars"
              value={model}
              onChange={(event) => setModel(event.target.value)}
              required
            >
              <option value="" disabled>Choose car make and model</option>
              {carModels.map((carModel) => {
                const value = `${carModel.CarMake}::${carModel.CarModel}`;
                return <option key={value} value={value}>{carModel.CarMake} {carModel.CarModel}</option>;
              })}
            </select>

            <label htmlFor="car-year">Car year</label>
            <input
              id="car-year"
              name="car_year"
              type="number"
              min="1886"
              max={new Date().getFullYear() + 1}
              value={year}
              onChange={(event) => setYear(event.target.value)}
              required
            />

            {error && <p role="alert">{error}</p>}
            <button className="postreview" type="submit" disabled={submitting || loading}>
              {submitting ? "Submitting..." : "Post Review"}
            </button>
          </form>
        )}
      </main>
    </div>
  );
};

export default PostReview;
