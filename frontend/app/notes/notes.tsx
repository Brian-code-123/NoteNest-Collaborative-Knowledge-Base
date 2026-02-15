"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import EmptyState from "@/components/EmptyState";
import ErrorState from "@/components/ErrorState";
import { SkeletonList } from "@/components/Skeleton";
import { usePermissions } from "@/hooks/usePermissions";

const STORAGE_KEY = "notenest-notes";
const TITLE_MAX_LENGTH = 200;

interface Note {
  id: number;
  title: string;
  content?: string;
  updatedAt: string;
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

const CREATE_RESTRICTED_TITLE =
  "You need Editor or Admin role to create notes.";
const DELETE_RESTRICTED_TITLE =
  "You need Editor or Admin role to delete notes.";

export default function NotesPage() {
  const searchParams = useSearchParams();
  const { canCreateNote, canDeleteNote, isViewer } = usePermissions();

  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createTitle, setCreateTitle] = useState("");
  const [createContent, setCreateContent] = useState("");
  const [createTitleError, setCreateTitleError] = useState("");
  const [isSubmittingCreate, setIsSubmittingCreate] = useState(false);
  const [createSuccessMessage, setCreateSuccessMessage] =
    useState<string | null>(null);

  const [viewingNote, setViewingNote] = useState<Note | null>(null);
  const createButtonRef = useRef<HTMLButtonElement>(null);

  /* ---------- Initial Load ---------- */
  useEffect(() => {
    const stored = loadNotesFromStorage();
    const timer = setTimeout(() => {
      setNotes(
        stored.length > 0
          ? stored
          : [
              {
                id: 1,
                title: "Project Overview",
                content: "A high-level overview of the project.",
                updatedAt: "2 hours ago",
              },
              {
                id: 2,
                title: "Meeting Notes",
                content: "Key points from the last team sync.",
                updatedAt: "Yesterday",
              },
            ]
      );
      setIsLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isLoading) saveNotesToStorage(notes);
  }, [notes, isLoading]);

  /* ---------- ?new=1 ---------- */
  useEffect(() => {
    if (searchParams.get("new") === "1" && canCreateNote) {
      setShowCreateModal(true);
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, [searchParams, canCreateNote]);

  /* ---------- Keyboard ---------- */
  useEffect(() => {
    if (!viewingNote) return;
    const esc = () => setViewingNote(null);
    window.addEventListener("shortcut-esc", esc);
    return () => window.removeEventListener("shortcut-esc", esc);
  }, [viewingNote]);

  /* ---------- Create Note ---------- */
  const handleCreateNote = useCallback(() => {
    if (!canCreateNote) return;
    setCreateTitle("");
    setCreateContent("");
    setCreateTitleError("");
    setShowCreateModal(true);
  }, [canCreateNote]);

  const handleCloseCreateModal = useCallback(() => {
    if (isSubmittingCreate) return;
    setShowCreateModal(false);
    createButtonRef.current?.focus();
  }, [isSubmittingCreate]);

  const handleSubmitCreate = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const title = createTitle.trim();

      if (!title) {
        setCreateTitleError("Title is required");
        return;
      }
      if (title.length > TITLE_MAX_LENGTH) {
        setCreateTitleError(
          `Title must be ${TITLE_MAX_LENGTH} characters or less`
        );
        return;
      }

      const newNote: Note = {
        id: Date.now(),
        title,
        content: createContent.trim() || undefined,
        updatedAt: "Just now",
      };

      setNotes((prev) => [...prev, newNote]);
      setShowCreateModal(false);
      setCreateSuccessMessage("Note created");
      setTimeout(() => setCreateSuccessMessage(null), 2000);
    },
    [createTitle, createContent]
  );

  const handleDeleteNote = (id: number) => {
    if (viewingNote?.id === id) setViewingNote(null);
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          title="Notes"
          showSearch
          action={
            canCreateNote ? (
              <button
                ref={createButtonRef}
                className="btn-primary"
                onClick={handleCreateNote}
              >
                Create Note
              </button>
            ) : (
              <span title={CREATE_RESTRICTED_TITLE}>Create Note</span>
            )
          }
        />

        <main className="flex-1 overflow-auto flex justify-center">
          <div className="max-w-3xl w-full p-6">
            {createSuccessMessage && (
              <div className="mb-4 text-green-600 font-medium">
                {createSuccessMessage}
              </div>
            )}

            {loadError && (
              <ErrorState
                title="Couldn't load notes"
                message={loadError}
                variant="error"
              />
            )}

            {isLoading ? (
              <SkeletonList count={4} />
            ) : notes.length === 0 ? (
              <EmptyState
                title="No notes yet"
                description={
                  isViewer
                    ? "You can view notes only."
                    : "Get started by creating your first note."
                }
                action={
                  canCreateNote && (
                    <button
                      className="btn-primary"
                      onClick={handleCreateNote}
                    >
                      Create your first note
                    </button>
                  )
                }
              />
            ) : (
              <ul className="space-y-3">
                {notes.map((note) => (
                  <li
                    key={note.id}
                    className="rounded-xl border flex gap-4 p-4 bg-white shadow-sm group"
                  >
                    <button
                      type="button"
                      onClick={() => setViewingNote(note)}
                      className="flex-1 text-left"
                    >
                      <h4 className="font-semibold truncate">
                        {note.title}
                      </h4>
                      <p className="text-sm truncate mt-1">
                        {note.content || "No content"}
                      </p>
                      <p className="text-xs mt-1 text-gray-500">
                        Updated {note.updatedAt}
                      </p>
                    </button>

                    {canDeleteNote ? (
                      <button
                        className="btn-icon text-red-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteNote(note.id);
                        }}
                        title="Delete note"
                      >
                        🗑
                      </button>
                    ) : (
                      <span title={DELETE_RESTRICTED_TITLE}>🔒</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </main>
      </div>

      {/* ---------- Create Note Modal ---------- */}
      {showCreateModal && canCreateNote && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={handleCloseCreateModal}
        >
          <div
            className="bg-white rounded-xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold mb-4">New note</h2>

            <form onSubmit={handleSubmitCreate} noValidate>
              {/* Title */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={createTitle}
                  maxLength={TITLE_MAX_LENGTH}
                  onChange={(e) => {
                    setCreateTitle(e.target.value);
                    setCreateTitleError("");
                  }}
                  className="w-full rounded-lg border px-3 py-2"
                  required
                />
                <p className="text-xs mt-1 text-gray-500">
                  This title will be shown in your notes list
                </p>
                {createTitleError && (
                  <p className="text-xs text-red-600 mt-1">
                    {createTitleError}
                  </p>
                )}
              </div>

              {/* Content */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Content (optional)
                </label>
                <textarea
                  value={createContent}
                  onChange={(e) => setCreateContent(e.target.value)}
                  rows={4}
                  className="w-full rounded-lg border px-3 py-2"
                />
                <p className="text-xs mt-1 text-gray-500">
                  Optional details or notes you want to remember
                </p>
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleCloseCreateModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isSubmittingCreate}
                >
                  Create note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------- View Note Modal ---------- */}
      {viewingNote && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={() => setViewingNote(null)}
        >
          <div
            className="bg-white rounded-xl max-w-lg w-full p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="btn-icon absolute top-3 right-3"
              onClick={() => setViewingNote(null)}
              title="Close"
            >
              ✕
            </button>
            <h2 className="text-xl font-semibold mb-4">
              {viewingNote.title}
            </h2>
            <p className="text-sm whitespace-pre-wrap">
              {viewingNote.content || "No content yet."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
