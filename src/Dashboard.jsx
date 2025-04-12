import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend);

const API_KEY = "9ff37e06";

export default function Dashboard() {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("Avengers");
  const [filterType, setFilterType] = useState("All");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovies = async () => {
      const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${searchQuery}`);
      const json = await res.json();
      if (json.Search) {
        // Fetch imdbRating for each movie
        const detailed = await Promise.all(
          json.Search.map(async (m) => {
            const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${m.imdbID}`);
            return await res.json();
          })
        );
        setMovies(detailed);
      } else {
        setMovies([]);
      }
    };
    if (searchQuery.length > 2) fetchMovies();
  }, [searchQuery]);

  const filteredMovies = movies.filter(
    (movie) => filterType === "All" || movie.Type === filterType
  );

  const typeData = {
    labels: ["Movie", "Series"],
    datasets: [
      {
        label: "# by Type",
        data: [
          movies.filter((m) => m.Type === "movie").length,
          movies.filter((m) => m.Type === "series").length,
        ],
        backgroundColor: ["#3498db", "#e67e22"],
      },
    ],
  };

  const ratingBuckets = [
    { label: "1–2", min: 1, max: 2 },
    { label: "2–3", min: 2, max: 3 },
    { label: "3–4", min: 3, max: 4 },
    { label: "4–5", min: 4, max: 5 },
    { label: "5–6", min: 5, max: 6 },
    { label: "6–7", min: 6, max: 7 },
    { label: "7–8", min: 7, max: 8 },
    { label: "8–9", min: 8, max: 9 },
    { label: "9–10", min: 9, max: 10 },
  ];
  
  const ratingData = {
    labels: ratingBuckets.map((b) => b.label),
    datasets: [
      {
        label: "Rating Range",
        data: ratingBuckets.map((b) =>
          movies.filter((m) => {
            const rating = parseFloat(m.imdbRating);
            return !isNaN(rating) && rating >= b.min && rating < b.max;
          }).length
        ),
        backgroundColor: "#2ecc71",
      },
    ],
  };
  

  return (
    <div className="container">
      <Sidebar />
      <h1>OMDb Dashboard</h1>

      <div className="search-filter">
        <input
          className="search-bar"
          type="text"
          placeholder="Search movies..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select onChange={(e) => setFilterType(e.target.value)}>
          <option value="All">All Types</option>
          <option value="movie">Movies</option>
          <option value="series">Series</option>
        </select>
      </div>

      <div className="summary">
        <p>Total Results: {movies.length}</p>
        <p>Searched for: "{searchQuery}"</p>
        <p>Filtered: {filteredMovies.length}</p>
      </div>

      <div className="charts">
        <div className="chart">
          <h3>Type Distribution</h3>
          <Pie data={typeData} />
        </div>
        <div className="chart">
          <h3>Rating Distribution</h3>
          <Bar data={ratingData} />
        </div>
      </div>

      <div className="item-list">
        {filteredMovies.slice(0, 10).map((movie) => (
          <div className="item" key={movie.imdbID} onClick={() => navigate(`/movie/${movie.imdbID}`)}>
            <img
              className="movie-img"
              src={movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/100"}
              alt={movie.Title}
            />
            <div className="item-details">
              <p className="item-title">{movie.Title}</p>
              <p>Year: {movie.Year}</p>
              <p>Type: {movie.Type}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
