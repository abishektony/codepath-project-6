// src/MovieDetail.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";

const API_KEY = "9ff37e06";

export default function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}&plot=full`);
      const json = await res.json();
      setMovie(json);
    };
    fetchDetail();
  }, [id]);

  if (!movie) return <div>Loading...</div>;

  return (
    <div className="container">
      <Sidebar />
      <h1>{movie.Title}</h1>
      <img
        src={movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/150"}
        alt={movie.Title}
      />
      <p><strong>Year:</strong> {movie.Year}</p>
      <p><strong>Genre:</strong> {movie.Genre}</p>
      <p><strong>Director:</strong> {movie.Director}</p>
      <p><strong>Actors:</strong> {movie.Actors}</p>
      <p><strong>Plot:</strong> {movie.Plot}</p>
      <p><strong>IMDB Rating:</strong> {movie.imdbRating}</p>
    </div>
  );
}
