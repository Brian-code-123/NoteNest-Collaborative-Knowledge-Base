"use client";

import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function WorkspaceHome({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header title="Home" />

        <main className="p-8 max-w-3xl">
          <h1 className="text-2xl font-semibold mb-2">
            Welcome to your workspace 👋
          </h1>

          <p className="text-gray-500 mb-6">
            This is your personal workspace. Use quick actions to get started.
          </p>

          <div className="flex gap-4">
            <Link
              href={`/workspace/${params.id}/notes?new=1`}
              className="px-4 py-2 bg-black text-white rounded"
            >
              Create Note
            </Link>

            <Link
              href={`/workspace/${params.id}/dashboard`}
              className="px-4 py-2 border rounded"
            >
              Go to Dashboard
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}