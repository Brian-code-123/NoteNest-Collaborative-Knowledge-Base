"use client";

import React from "react";
import WorkspaceSelector from "@/components/WorkspaceSelector";
import { useUserRole } from "@/contexts/UserRoleContext";

interface HeaderProps {
  title?: string;
  /** When true, shows a search input that can be focused with / shortcut */
  showSearch?: boolean;
  /** Optional node rendered on the right (e.g. Create Note button) */
  action?: React.ReactNode;
}

export default function Header({
  title = "Dashboard",
  showSearch = false,
  action,
}: HeaderProps) {
  const { isAuthenticated, logout } = useUserRole();

  return (
    <header
      className="flex items-center gap-4 border-b px-6 py-4"
      style={{
        background: "var(--color-background)",
        borderColor: "var(--color-border-light)",
      }}
    >
      <WorkspaceSelector />
      <h1
        className="text-xl font-semibold shrink-0"
        style={{ color: "var(--color-text-primary)" }}
      >
        {title}
      </h1>
      {showSearch && (
        <input
          type="search"
          data-shortcut="search"
          placeholder="Search notes…"
          aria-label="Search notes"
          className="flex-1 max-w-md rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[var(--color-info)]"
          style={{
            borderColor: "var(--color-border-light)",
            color: "var(--color-text-primary)",
            background: "var(--color-background)",
            fontSize: "var(--font-size-sm)",
          }}
        />
      )}
      <div className="shrink-0 ml-auto flex items-center gap-3">
        {isAuthenticated && (
          <button
            onClick={logout}
            className="btn-secondary text-sm"
            style={{
              fontSize: "var(--font-size-sm)",
              padding: "var(--space-sm) var(--space-md)",
            }}
          >
            Logout
          </button>
        )}
        {action}
      </div>
    </header>
  );
}
