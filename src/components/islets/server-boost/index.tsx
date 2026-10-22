"use client";
import { clsx } from "@/lib/utils";
import Divider from "@/components/ui/divider";
import { ListedServer } from "@/lib/entities/server";
import {
  getBoostLevel,
  getNextBoostLevel,
  MAX_SERVER_BOOSTS,
} from "@/lib/utils/boost";
import { useHydrateNitro } from "@/state/nitro";
import { useServerStore } from "@/state/server-list";
import Link from "next/link";
import { BsGem } from "react-icons/bs";

export default function ServerBoost({ server }: { server: ListedServer }) {
  const nitro = useHydrateNitro();
  const updateServer = useServerStore((state) => state.updateServer);

  const boosts = server.boosts ?? 0;
  const level = getBoostLevel(boosts);
  const nextLevel = getNextBoostLevel(boosts);
  const hasNitro = nitro?.active ?? false;
  const isMaxed = boosts >= MAX_SERVER_BOOSTS;

  return (
    <div className="mb-4 rounded-md border border-gray-800 bg-midground p-3">
      <div className="flex items-center gap-2 text-sm font-semibold text-gray-100">
        <BsGem className="flex-none text-primary" />
        Server Boost
        <span className="ml-auto text-xs font-normal text-gray-400">
          Level {level}
        </span>
      </div>
      <p className="mt-1 text-xs text-gray-400">
        {boosts} {boosts === 1 ? "boost" : "boosts"}
        {nextLevel
          ? ` · ${nextLevel.boosts - boosts} more for Level ${nextLevel.level}`
          : " · highest level reached"}
      </p>
      <Divider className="my-2 h-[1px] w-full" />
      {hasNitro ? (
        <button
          type="button"
          disabled={isMaxed}
          onClick={() => updateServer(server.id, { boosts: boosts + 1 })}
          className={clsx(
            "w-full rounded bg-primary px-3 py-2 text-xs font-semibold text-white transition-colors",
            isMaxed ? "cursor-not-allowed opacity-50" : "hover:bg-[#4751be]",
          )}
        >
          {isMaxed ? "Highest level reached" : "Boost this server"}
        </button>
      ) : (
        <Link
          href="/nitro"
          className="block w-full rounded bg-primary px-3 py-2 text-center text-xs font-semibold text-white transition-colors hover:bg-[#4751be]"
        >
          Get Nitro to boost this server
        </Link>
      )}
    </div>
  );
}
