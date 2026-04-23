"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

const API_BASE = "http://127.0.0.1:8000";

export default function MoviesPage() {
  const [movies, setMovies] = useState<any[]>([]);
  const [page, setPage] = useState(1);

  const LIMIT = 25;

  const fetchMovies = async (pageNumber: number) => {
    const offset = (pageNumber - 1) * LIMIT;

    const res = await fetch(
      `${API_BASE}/movies?limit=${LIMIT}&offset=${offset}`
    );
    const data = await res.json();
    setMovies(data.movies);
  };

  useEffect(() => {
    fetchMovies(page);
  }, [page]);

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Movie Directory</h1>

      {/* ========================= */}
      {/* MOVIE GRID */}
      {/* ========================= */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {movies.map((m) => (
          <Card
            key={m.movie_id}
            className="overflow-hidden hover:shadow-lg transition"
          >
            {/* POSTER */}
            <img
              src={m.poster || "/placeholder.png"}
              alt={m.title}
              className="w-full h-[260px] object-cover hover:scale-105 transition"
            />

            {/* CONTENT */}
            <CardContent className="p-3">
              <p className="text-sm font-semibold line-clamp-2">
                {m.title}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ========================= */}
      {/* PAGINATION */}
      {/* ========================= */}
      <div className="flex gap-4 items-center justify-center">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Previous
        </button>

        <span className="text-sm">Page {page}</span>

        <button
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 border rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}