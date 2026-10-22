"use client";
import DemoBanner from "@/components/layout/demo-banner";
import Avatar from "@/components/ui/avatar";
import {
  AuthProvider,
  PROVIDER_LABELS,
  useHydrateSession,
  useSessionStore,
} from "@/state/session";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { BsDiscord, BsGoogle } from "react-icons/bs";

const PROVIDERS: {
  id: AuthProvider;
  label: string;
  className: string;
  icon: React.ReactNode;
}[] = [
  {
    id: "discord",
    label: "Continue with Discord",
    className: "bg-[#5865f2] text-white hover:bg-[#4752c4]",
    icon: <BsDiscord fontSize={20} />,
  },
  {
    id: "google",
    label: "Continue with Google",
    className: "bg-white text-[#1f1f1f] hover:bg-gray-100",
    icon: <BsGoogle fontSize={18} />,
  },
];

export default function LoginPage() {
  const session = useHydrateSession();
  const signIn = useSessionStore((state) => state.signIn);
  const signOut = useSessionStore((state) => state.signOut);
  const router = useRouter();

  const handleSignIn = (provider: AuthProvider) => {
    signIn(provider);
    router.push("/channels/me");
  };

  return (
    <>
      <DemoBanner />
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-semibackground to-background px-4 py-12">
        <div className="w-full max-w-md rounded-lg bg-midground p-8 shadow-xl">
          <div className="flex flex-col items-center gap-2 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white">
              <BsDiscord fontSize={26} />
            </span>
            <h1 className="text-2xl font-semibold text-gray-100">
              Welcome back!
            </h1>
            <p className="text-sm text-gray-400">
              Sign in to continue to Rediscord.
            </p>
          </div>

          {session && (
            <div className="mt-6 flex items-center gap-3 rounded bg-foreground p-3">
              <Avatar src={session.avatar} alt={session.name} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-gray-100">
                  {session.name}
                </p>
                <p className="truncate text-xs text-gray-400">
                  Signed in with {PROVIDER_LABELS[session.provider]}
                </p>
              </div>
              <Link
                href="/channels/me"
                className="flex-none rounded bg-primary px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#4751be]"
              >
                Continue
              </Link>
              <button
                type="button"
                onClick={() => signOut()}
                className="flex-none text-xs text-gray-400 transition-colors hover:text-gray-200"
              >
                Sign out
              </button>
            </div>
          )}

          <div className="mt-6 flex flex-col gap-3">
            {PROVIDERS.map((provider) => (
              <button
                key={provider.id}
                type="button"
                onClick={() => handleSignIn(provider.id)}
                className={`flex items-center justify-center gap-3 rounded px-4 py-2.5 text-sm font-semibold transition-colors ${provider.className}`}
              >
                {provider.icon}
                {provider.label}
              </button>
            ))}
          </div>

          <p className="mt-6 text-center text-xs leading-relaxed text-gray-500">
            Preview build — signing in keeps a local demo session in this
            browser. Nothing is sent to Discord or Google.
          </p>
        </div>
      </main>
    </>
  );
}
