"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const API_BASE = "http://127.0.0.1:8000";

export default function Dashboard() {
  const [movies, setMovies] = useState<any[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const [selectedMovies, setSelectedMovies] = useState<number[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  const LIMIT = 25;

  // =========================
  // FETCH MOVIES
  // =========================
  const fetchMovies = async (pageNumber: number) => {
    const offset = (pageNumber - 1) * LIMIT;

    const res = await fetch(
      `${API_BASE}/movies?limit=${LIMIT}&offset=${offset}`
    );
    const data = await res.json();

    setMovies(data.movies);
    setFilteredMovies(data.movies);
  };

  useEffect(() => {
    fetchMovies(page);
  }, [page]);

  // =========================
  // SEARCH FILTER
  // =========================
  useEffect(() => {
    if (!search) {
      setFilteredMovies(movies);
    } else {
      setFilteredMovies(
        movies.filter((m) =>
          m.title.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, movies]);

  // =========================
  // TOGGLE MOVIE SELECT
  // =========================
  const toggleMovie = (id: number) => {
    setSelectedMovies((prev) =>
      prev.includes(id)
        ? prev.filter((m) => m !== id)
        : [...prev, id]
    );
  };

  // =========================
  // FETCH RECOMMENDATIONS
  // =========================
  const fetchRecommendations = async () => {
    const res = await fetch(`${API_BASE}/recommend/new`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ movies: selectedMovies }),
    });

    const data = await res.json();
    setRecommendations(data.recommendations || []);
  };

  return (
    <div className="flex gap-6 p-6">
      {/* ========================= */}
      {/* LEFT PANEL */}
      {/* ========================= */}
      <div className="w-[350px] space-y-4">
        <h2 className="text-xl font-bold">Select Movies</h2>

        {/* SEARCH */}
        <Input
          placeholder="Search movies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* MOVIE LIST */}
        <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
          {filteredMovies.map((m) => (
            <Button
              key={m.movie_id}
              variant={
                selectedMovies.includes(m.movie_id)
                  ? "default"
                  : "outline"
              }
              className="w-full justify-start gap-3 h-auto py-2"
              onClick={() => toggleMovie(m.movie_id)}
            >
              <img
                src={m.poster || "/placeholder.png"}
                alt={m.title}
                className="w-10 h-14 object-cover rounded"
              />
              <span className="text-left text-sm line-clamp-2">
                {m.title}
              </span>
            </Button>
          ))}
        </div>

        {/* PAGINATION */}
        <div className="flex gap-2 items-center">
          <Button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>

          <span className="text-sm">Page {page}</span>

          <Button onClick={() => setPage((p) => p + 1)}>
            Next
          </Button>
        </div>

        {/* ACTION */}
        <Button
          className="w-full"
          onClick={fetchRecommendations}
          disabled={selectedMovies.length === 0}
        >
          Get Recommendations
        </Button>
      </div>

      {/* ========================= */}
      {/* RIGHT PANEL */}
      {/* ========================= */}
      <div className="flex-1">
        <h2 className="text-xl font-bold mb-4">
          Recommendations
        </h2>

        {recommendations.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {recommendations.map((m, i) => (
              <div
                key={i}
                className="rounded-xl border overflow-hidden hover:shadow-lg transition"
              >
                <img
                  src={m.poster || "/placeholder.png"}
                  alt={m.title}
                  className="w-full h-[260px] object-cover hover:scale-105 transition"
                />

                <div className="p-3">
                  <p className="font-semibold text-sm line-clamp-2">
                    {m.title}
                  </p>

                  <Badge className="mt-2">
                    ⭐ {m.predicted_rating}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">
            Select movies to generate recommendations
          </p>
        )}
      </div>
    </div>
  );
}