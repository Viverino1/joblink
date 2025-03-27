"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";

type BookmarksContextType = {
  bookmarkedJobs: Set<string>;
  toggleBookmark: (jobId: string) => Promise<void>;
};

const BookmarksContext = createContext<BookmarksContextType | null>(null);

export function BookmarksProvider({ children }: { children: React.ReactNode }) {
  const { userId } = useAuth();
  const [bookmarkedJobs, setBookmarkedJobs] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function fetchBookmarks() {
      if (!userId) return;
      try {
        const response = await fetch("/api/bookmarks");
        const data = await response.json();
        if (data && Array.isArray(data)) {
          setBookmarkedJobs(
            new Set(data.map((bookmark: { id: string }) => bookmark.id))
          );
        }
      } catch (error) {
        console.error("Error fetching bookmarks:", error);
      }
    }
    fetchBookmarks();
  }, [userId]);

  const toggleBookmark = async (jobId: string) => {
    if (!userId) return;

    setBookmarkedJobs((prev) => {
      const next = new Set(prev);
      if (next.has(jobId)) {
        next.delete(jobId);
      } else {
        next.add(jobId);
      }
      return next;
    });

    try {
      const response = await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      });
      const { isBookmarked } = await response.json();

      if (isBookmarked !== bookmarkedJobs.has(jobId)) {
        setBookmarkedJobs((prev) => {
          const next = new Set(prev);
          if (isBookmarked) {
            next.add(jobId);
          } else {
            next.delete(jobId);
          }
          return next;
        });
      }
    } catch (error) {
      setBookmarkedJobs((prev) => {
        const next = new Set(prev);
        if (next.has(jobId)) {
          next.delete(jobId);
        } else {
          next.add(jobId);
        }
        return next;
      });
      console.error("Error toggling bookmark:", error);
    }
  };

  return (
    <BookmarksContext.Provider value={{ bookmarkedJobs, toggleBookmark }}>
      {children}
    </BookmarksContext.Provider>
  );
}

export function useBookmarks() {
  const context = useContext(BookmarksContext);
  if (!context) {
    throw new Error("useBookmarks must be used within a BookmarksProvider");
  }
  return context;
}