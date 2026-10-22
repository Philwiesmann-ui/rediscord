"use client";
import { StaticUserStatuses, User } from "@/lib/entities/user";
import { PREVIEW_CURRENT_USER } from "@/lib/utils/mock";
import { useEffect } from "react";
import { create } from "zustand";

const STORAGE_KEY = "rediscord.session";

export type AuthProvider = "discord" | "google";

export type Session = {
  provider: AuthProvider;
  id: string;
  name: string;
  username: string;
  avatar: string | null;
  signedInAt: string;
};

export const PROVIDER_LABELS: Record<AuthProvider, string> = {
  discord: "Discord",
  google: "Google",
};

/*
 * Rediscord's preview has no backend, so signing in keeps a local session for
 * the preview account instead of talking to Discord or Google.
 */
export const PROVIDER_ACCOUNTS: Record<
  AuthProvider,
  Omit<Session, "provider" | "signedInAt">
> = {
  discord: {
    id: "100000000000000002",
    name: "Repeep",
    username: "reepep",
    avatar: PREVIEW_CURRENT_USER.avatar ?? null,
  },
  google: {
    id: "100000000000000003",
    name: "Repeep",
    username: "repeep@gmail.com",
    avatar: PREVIEW_CURRENT_USER.avatar ?? null,
  },
};

const readStoredSession = (): Session | null => {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as Session) : null;
  } catch {
    return null;
  }
};

const writeStoredSession = (session: Session | null) => {
  if (typeof window === "undefined") {
    return;
  }
  if (session) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } else {
    window.localStorage.removeItem(STORAGE_KEY);
  }
};

type SessionStore = {
  /* `undefined` until the stored session has been read after mount. */
  session: Session | null | undefined;
  signIn: (provider: AuthProvider) => void;
  signOut: () => void;
};

export const useSessionStore = create<SessionStore>((set) => ({
  session: undefined,
  signIn: (provider) =>
    set(() => {
      const session: Session = {
        provider,
        ...PROVIDER_ACCOUNTS[provider],
        signedInAt: new Date().toISOString(),
      };
      writeStoredSession(session);
      return { session };
    }),
  signOut: () =>
    set(() => {
      writeStoredSession(null);
      return { session: null };
    }),
}));

/*
 * The session lives in the browser, so it is read after mount. Until then the
 * store stays `undefined` and the UI keeps its loading state, which keeps the
 * server-rendered markup and the first client render identical.
 */
export const useHydrateSession = () => {
  const session = useSessionStore((state) => state.session);

  useEffect(() => {
    if (session === undefined) {
      useSessionStore.setState({ session: readStoredSession() });
    }
  }, [session]);

  return session;
};

export const sessionToUser = (session: Session): User => ({
  id: session.id,
  name: session.name,
  username: session.username,
  avatar: session.avatar,
  status: StaticUserStatuses.Online,
});
