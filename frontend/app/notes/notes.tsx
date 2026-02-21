"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import EmptyState from "@/components/EmptyState";
import { SkeletonList } from "@/components/Skeleton";
import { usePermissions } from "@/hooks/usePermissions";

const STORAGE_KEY = "notenest-notes";
const TITLE_MAX_LENGTH = 200;
const DRAFT_KEY = "notenest-note-draft";

interface Note {
  id: number;
  title: string;
  content?: string;
  createdAt: number;
}

function loadNotesFromStorage(): Note[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveNotesToStorage(notes: Note[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }
}

function formatRelativeTime(timestamp?: number) {
  if (!timestamp) return "Created recently";

  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);

  if (minutes < 1) return "Created just now";
  if (minutes < 60) return `Created ${minutes} minutes ago`;
  return `Created ${hours} hours ago`;
}

export default function NotesPage() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";
  const { canCreateNote, isViewer } = usePermissions();

  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] =
    useState<"newest" | "oldest" | "az">("newest");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createTitle, setCreateTitle] = useState("");
  const [createContent, setCreateContent] = useState("");
  const [createTitleError, setCreateTitleError] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recentlyDeleted, setRecentlyDeleted] = useState<Note | null>(null);
const [showUndoToast, setShowUndoToast] = useState(false);
const deleteTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const createButtonRef = useRef<HTMLButtonElement>(null);
useEffect(() => {
  if (!showCreateModal) return;

  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return;

    const draft = JSON.parse(raw);

    if (typeof draft.title === "string") {
      setCreateTitle(draft.title);
    }

    if (typeof draft.content === "string") {
      setCreateContent(draft.content);
    }
  } catch {
    // ignore invalid draft
  }
}, [showCreateModal]);
useEffect(() => {
  if (!showCreateModal) return;

  const draft = {
    title: createTitle,
    content: createContent,
  };

  localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
}, [createTitle, createContent, showCreateModal]);
  /* Initial load */
  useEffect(() => {
    const stored = loadNotesFromStorage();
    setNotes(
      stored.length
        ? stored
        : [
            {
              id: 1,
              title: "Project Overview",
              content: "A high-level overview of the project.",
              createdAt: Date.now() - 3600000,
            },
          ]
    );
    setIsLoading(false);
  }, []);

  /* Sync search */
  useEffect(() => {
    setSearchQuery(search);
  }, [search]);

  /* Persist */
  useEffect(() => {
    if (!isLoading) saveNotesToStorage(notes);
  }, [notes, isLoading]);

  const filteredNotes = notes.filter((note) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      note.title.toLowerCase().includes(q) ||
      note.content?.toLowerCase().includes(q)
    );
  });

  const sortedNotes = [...filteredNotes].sort((a, b) => {
    const aTime = a.createdAt ?? a.id;
    const bTime = b.createdAt ?? b.id;

    if (sortBy === "newest") return bTime - aTime;
    if (sortBy === "oldest") return aTime - bTime;
    return a.title.localeCompare(b.title);
  });
const handleEditNote = (note: Note) => {
  setEditingNoteId(note.id);
  setCreateTitle(note.title);
  setCreateContent(note.content || "");
  setShowCreateModal(true);
};
  const handleCreateNote = useCallback(() => {
  if (!canCreateNote) return;
  setEditingNoteId(null);
  setCreateTitleError("");
  setShowCreateModal(true);
}, [canCreateNote]);

  const handleSubmitCreate = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      if (!createTitle.trim()) {
        setCreateTitleError("Title is required");
        return;
      }

      setIsSubmitting(true);

    if (editingNoteId !== null) {
  setNotes((prev) =>
    prev.map((n) =>
      n.id === editingNoteId
        ? {
            ...n,
            title: createTitle.trim(),
            content: createContent.trim() || undefined,
          }
        : n
    )
  );
} else {
  setNotes((prev) => [
    ...prev,
    {
      id: Date.now(),
      title: createTitle.trim(),
      content: createContent.trim() || undefined,
      createdAt: Date.now(),
    },
  ]);
  if (createTitle.length > TITLE_MAX_LENGTH) {
  setCreateTitleError(
    `Title must be ${TITLE_MAX_LENGTH} characters or less`
  );
  return;
}
}

setEditingNoteId(null);

      setShowCreateModal(false);
setCreateTitle("");
setCreateContent("");
localStorage.removeItem(DRAFT_KEY);
setIsSubmitting(false);
    },
    [createTitle, createContent]
  );
  const handleDeleteNote = (note: Note) => {
  // Remove note immediately
  setNotes((prev) => prev.filter((n) => n.id !== note.id));

  // Store deleted note for undo
  setRecentlyDeleted(note);
  setShowUndoToast(true);

  // Clear previous timer
  if (deleteTimeoutRef.current) {
    clearTimeout(deleteTimeoutRef.current);
  }

  // Finalize delete after 5 seconds
  deleteTimeoutRef.current = setTimeout(() => {
    setRecentlyDeleted(null);
    setShowUndoToast(false);
  }, 5000);
 

};

  return (
    <>
      <div className="flex">
        <Sidebar />

        <div className="flex-1 flex flex-col">
          <Header
            title="Notes"
            showSearch
            action={
              canCreateNote && (
                <button
                  ref={createButtonRef}
                  onClick={handleCreateNote}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                >
                  + Create Note
                </button>
              )
            }
          />

          <main className="flex-1 overflow-y-auto">
            <div className="max-w-3xl mx-auto p-6">
              {/* Sort */}
              <div className="mb-4 flex justify-end items-center gap-2">
                <span className="text-sm text-gray-500">Sort by</span>
                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(e.target.value as "newest" | "oldest" | "az")
                  }
                  className="bg-white border rounded-lg px-3 py-2 text-sm shadow"
                >
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                  <option value="az">A–Z</option>
                </select>
              </div>

              {isLoading ? (
                <SkeletonList count={4} />
              ) : sortedNotes.length === 0 ? (
                <EmptyState
                  title="No results found"
                  description="Try adjusting your search keywords."
                />
              ) : (
                <ul className="space-y-3">
                  {sortedNotes.map((note) => (
                  <li
  key={note.id}
  className="rounded-xl border p-4 bg-white shadow-sm flex justify-between gap-4"
>
  <div>
    <h4 className="font-semibold">{note.title}</h4>
    <p className="text-xs text-gray-500">
      {formatRelativeTime(note.createdAt)}
    </p>
    <p className="text-sm text-gray-600">
      {note.content || "No content"}
    </p>
  </div>

  {!isViewer && (
    <div className="flex gap-2">
      <button
        onClick={() => handleEditNote(note)}
        title="Edit note"
        className="text-blue-600 hover:text-blue-700"
      >
        ✏️
      </button>

      <button
        onClick={() => handleDeleteNote(note)}
        title="Delete note"
        className="text-red-600 hover:text-red-700"
      >
        🗑️
      </button>
    </div>
  )}
</li>
                  ))}
                </ul>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">New note</h2>

            <form onSubmit={handleSubmitCreate}>
              <input
                value={createTitle}
                onChange={(e) => {
                  setCreateTitle(e.target.value);
                  setCreateTitleError("");
                }}
                className="w-full border p-2 mb-2"
                placeholder="Title"
              />
              <p className="text-xs text-gray-500 mb-2">
  {createTitle.length} / {TITLE_MAX_LENGTH} characters
</p>

              {createTitleError && (
                <p className="text-sm text-red-600">{createTitleError}</p>
              )}

              <textarea
                value={createContent}
                onChange={(e) => setCreateContent(e.target.value)}
                className="w-full border p-2 mb-4"
                placeholder="Content (optional)"
              />

              <div className="flex justify-end gap-3">
                <button
  type="button"
  onClick={() => {
  setShowCreateModal(false);
}}
  className="px-4 py-2 border rounded"
>
  Cancel
</button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                  disabled={isSubmitting}
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showUndoToast && recentlyDeleted && (
  <div
    role="status"
    aria-live="polite"
    className="
      fixed bottom-6 left-1/2 -translate-x-1/2
      bg-gray-900 text-white
      px-4 py-3 rounded-lg shadow-lg
      flex items-center gap-4 z-50
    "
  >
    <span>Note deleted</span>

    <button
      onClick={() => {
        // Restore note
        setNotes((prev) => [...prev, recentlyDeleted]);

        // Cleanup
        if (deleteTimeoutRef.current) {
          clearTimeout(deleteTimeoutRef.current);
        }
        setRecentlyDeleted(null);
        setShowUndoToast(false);
      }}
      className="underline font-semibold"
    >
      Undo
    </button>
  </div>
)}
    </>
  );
}