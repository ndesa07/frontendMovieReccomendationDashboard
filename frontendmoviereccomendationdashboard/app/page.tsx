"use client";

import React, { useEffect, useEffectEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const API_BASE = "http://127.0.0.1:8000";
const MODEL_OPTIONS = [
  { value: "heuristic", label: "Heuristic" },
  { value: "pagerank", label: "PageRank" },
  { value: "node2vec", label: "Node2Vec" },
] as const;

type RecommendationModel = (typeof MODEL_OPTIONS)[number]["value"];

type Movie = {
  movie_id: number;
  title: string;
  poster?: string | null;
  predicted_rating?: number | null;
  score?: number | null;
};

type MoviesResponse = {
  movies: Movie[];
};

type SearchResponse = {
  results: Movie[];
};

type RecommendationsResponse = {
  recommendations?: Movie[];
};

export default function Dashboard() {
  const [displayedMovies, setDisplayedMovies] = useState<Movie[]>([]);
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const [selectedMovies, setSelectedMovies] = useState<number[]>([]);
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [selectedModel, setSelectedModel] =
    useState<RecommendationModel>("heuristic");

  const LIMIT = 25;

  // =========================
  // 🔥 SORT FUNCTION (SELECTED ON TOP)
  // =========================
  const sortMovies = (moviesList: Movie[], selected: number[]) => {
    return [...moviesList].sort((a, b) => {
      const aSelected = selected.includes(a.movie_id);
      const bSelected = selected.includes(b.movie_id);

      if (aSelected && !bSelected) return -1;
      if (!aSelected && bSelected) return 1;
      return 0;
    });
  };

  // =========================
  // FETCH PAGINATED MOVIES
  // =========================
  const fetchMovies = async (pageNumber: number) => {
    const offset = (pageNumber - 1) * LIMIT;

    const res = await fetch(
      `${API_BASE}/movies?limit=${LIMIT}&offset=${offset}`
    );
    const data: MoviesResponse = await res.json();

    setDisplayedMovies(sortMovies(data.movies, selectedMovies));
  };

  // =========================
  // SEARCH MOVIES (FULL DB)
  // =========================
  const searchMovies = async (query: string) => {
    if (!query) {
      await fetchMovies(page);
      return;
    }

    const res = await fetch(
      `${API_BASE}/search?query=${encodeURIComponent(query)}&limit=50&offset=0`
    );

    const data: SearchResponse = await res.json();
    setDisplayedMovies(sortMovies(data.results, selectedMovies));
  };

  const loadMoviesForPage = useEffectEvent((pageNumber: number) => {
    void fetchMovies(pageNumber);
  });

  const runMovieSearch = useEffectEvent((query: string) => {
    void searchMovies(query);
  });

  // =========================
  // EFFECTS
  // =========================
  useEffect(() => {
    if (!search) {
      const timeoutId = window.setTimeout(() => {
        loadMoviesForPage(page);
      }, 0);

      return () => window.clearTimeout(timeoutId);
    }
  }, [page, search]);

  // Debounced search
  useEffect(() => {
    const delay = setTimeout(() => {
      runMovieSearch(search);
    }, 300);

    return () => clearTimeout(delay);
  }, [search]);

  // =========================
  // TOGGLE MOVIE SELECT
  // =========================
  const toggleMovie = (id: number) => {
    setSelectedMovies((prev) => {
      const updated = prev.includes(id)
        ? prev.filter((m) => m !== id)
        : [...prev, id];

      // 🔥 Reorder immediately
      console.log("Toggling movie:", id, "Selected movies:", updated);
      setDisplayedMovies((current) => sortMovies(current, updated));

      return updated;
    });
  };

  // =========================
  // FETCH RECOMMENDATIONS
  // =========================
  const fetchRecommendations = async () => {
    const res = await fetch(`${API_BASE}/recommend/new/${selectedModel}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ movies: selectedMovies }),
    });

    const data: RecommendationsResponse = await res.json();
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
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        {/* MOVIE LIST */}
        <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
          {displayedMovies.map((m) => (
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

        {/* PAGINATION (ONLY WHEN NOT SEARCHING) */}
        {!search && (
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
        )}

        {/* ACTION */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Recommendation Model</p>
          <Select
            value={selectedModel}
            onValueChange={(value) =>
              setSelectedModel(value as RecommendationModel)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent>
              {MODEL_OPTIONS.map((model) => (
                <SelectItem key={model.value} value={model.value}>
                  {model.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

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

                  {m.predicted_rating && (
                    <Badge className="mt-2">
                      ⭐ {m.predicted_rating}
                    </Badge>
                  )}

                  {m.score && (
                    <Badge className="mt-2">
                      Match: {m.score}
                    </Badge>
                  )}
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
