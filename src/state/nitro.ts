"use client";
import { useEffect } from "react";
import { create } from "zustand";

const STORAGE_KEY = "rediscord.nitro";

export type NitroMembership = {
  active: boolean;
  since: string | null;
};

const INACTIVE: NitroMembership = { active: false, since: null };

const readStoredNitro = (): NitroMembership => {
  if (typeof window === "undefined") {
    return INACTIVE;
  }
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as NitroMembership) : INACTIVE;
  } catch {
    return INACTIVE;
  }
};

const writeStoredNitro = (nitro: NitroMembership) => {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nitro));
};

type NitroStore = {
  nitro: NitroMembership | null;
  setNitro: (nitro: NitroMembership) => void;
};

export const useNitroStore = create<NitroStore>((set) => ({
  nitro: null,
  setNitro: (nitro) => {
    writeStoredNitro(nitro);
    set({ nitro });
  },
}));

/*
 * Nitro lives in the browser, so it is read after mount: until then the store
 * stays `null`, which keeps the server-rendered markup and the first client
 * render identical.
 */
export const useHydrateNitro = () => {
  const nitro = useNitroStore((state) => state.nitro);
  const setNitro = useNitroStore((state) => state.setNitro);

  useEffect(() => {
    if (nitro === null) {
      setNitro(readStoredNitro());
    }
  }, [nitro, setNitro]);

  return nitro;
};
