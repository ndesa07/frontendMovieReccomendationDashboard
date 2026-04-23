"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const API_BASE = "http://127.0.0.1:8000";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  const [userPage, setUserPage] = useState(1);
  const USER_LIMIT = 25;

  // =========================
  // FETCH USERS
  // =========================
  const fetchUsers = async (pageNumber: number) => {
    const offset = (pageNumber - 1) * USER_LIMIT;

    const res = await fetch(
      `${API_BASE}/users?limit=${USER_LIMIT}&offset=${offset}`
    );
    const data = await res.json();

    setUsers(data.users);
    setFilteredUsers(data.users);
  };

  useEffect(() => {
    fetchUsers(userPage);
  }, [userPage]);

  // =========================
  // SEARCH FILTER
  // =========================
  useEffect(() => {
    if (!search) {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(
        users.filter((u) =>
          u.name.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, users]);

  // =========================
  // FETCH RECOMMENDATIONS
  // =========================
  const fetchRecommendations = async () => {
    if (!selectedUser) return;

    const res = await fetch(`${API_BASE}/recommend/${selectedUser}`);
    const data = await res.json();
    setRecommendations(data.recommendations);
  };

  useEffect(() => {
    if (selectedUser) {
      fetchRecommendations();
    }
  }, [selectedUser]);

  return (
    <div className="flex gap-6">
      {/* ========================= */}
      {/* LEFT: USER SELECTOR */}
      {/* ========================= */}
      <div className="w-[300px] space-y-4">
        <h2 className="text-xl font-bold">Users</h2>

        <Input
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="space-y-2 max-h-[500px] overflow-y-auto">
          {filteredUsers.map((u) => (
            <Button
              key={u.id}
              variant={selectedUser === u.id ? "default" : "outline"}
              className="w-full justify-start"
              onClick={() => setSelectedUser(u.id)}
            >
              {u.name}
            </Button>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex gap-2">
          <Button
            disabled={userPage === 1}
            onClick={() => setUserPage((p) => p - 1)}
          >
            Previous
          </Button>

          <span>Page {userPage}</span>

          <Button onClick={() => setUserPage((p) => p + 1)}>
            Next
          </Button>
        </div>
      </div>

      {/* ========================= */}
      {/* RIGHT: RECOMMENDATIONS */}
      {/* ========================= */}
      <div className="flex-1">
        <h2 className="text-xl font-bold mb-4">
          {selectedUser
            ? `Recommendations for User ${selectedUser}`
            : "Select a user"}
        </h2>

        {recommendations.length > 0 ? (
          <div className="border rounded-xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Movie</TableHead>
                  <TableHead>Predicted Rating</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {recommendations.map((m, i) => (
                  <TableRow key={i}>
                    <TableCell>{m.title}</TableCell>
                    <TableCell>⭐ {m.predicted_rating}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <p className="text-muted-foreground">
            No recommendations yet
          </p>
        )}
      </div>
    </div>
  );
}