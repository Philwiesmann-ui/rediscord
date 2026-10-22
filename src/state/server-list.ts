"use client";
import { useEffect } from "react";
import { create } from "zustand";
import { ListedServer } from "@/lib/entities/server";

const STORAGE_KEY = "rediscord.servers";

const readStoredServers = (): ListedServer[] => {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as ListedServer[]) : [];
  } catch {
    return [];
  }
};

const writeStoredServers = (servers: ListedServer[]) => {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(servers));
};

type ServerStore = {
  servers: ListedServer[] | null;
  setServers: (servers: ListedServer[]) => void;
  addServer: (server: ListedServer) => void;
  updateServer: (id: string, patch: Partial<ListedServer>) => void;
};

export const useServerStore = create<ServerStore>((set) => ({
  servers: null,
  setServers: (servers) => set({ servers }),
  addServer: (server) =>
    set(({ servers }) => {
      const nextServers = [...(servers ?? []), server];
      writeStoredServers(nextServers);
      return { servers: nextServers };
    }),
  updateServer: (id, patch) =>
    set(({ servers }) => {
      const nextServers = (servers ?? []).map((server) =>
        server.id === id ? { ...server, ...patch } : server,
      );
      writeStoredServers(nextServers);
      return { servers: nextServers };
    }),
}));

/*
 * Servers live in the browser, so they are read after mount. Until then the
 * store stays `null` and the UI shows its loading state, which keeps the
 * server-rendered markup and the first client render identical.
 */
export const useHydrateServers = () => {
  const servers = useServerStore((state) => state.servers);
  const setServers = useServerStore((state) => state.setServers);

  useEffect(() => {
    if (servers === null) {
      setServers(readStoredServers());
    }
  }, [servers, setServers]);

  return servers;
};
