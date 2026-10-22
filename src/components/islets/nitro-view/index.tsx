"use client";
import Button from "@/components/ui/button/button";
import Divider from "@/components/ui/divider";
import { useHydrateNitro, useNitroStore } from "@/state/nitro";
import {
  BsCloudUpload,
  BsEmojiSmile,
  BsGem,
  BsLightningChargeFill,
} from "react-icons/bs";

const benefits = [
  {
    icon: <BsGem fontSize={20} />,
    title: "2 server boosts",
    text: "Push your favourite servers up a level.",
  },
  {
    icon: <BsCloudUpload fontSize={20} />,
    title: "Bigger uploads",
    text: "Share files up to 100 MB.",
  },
  {
    icon: <BsEmojiSmile fontSize={20} />,
    title: "Emoji everywhere",
    text: "Use your emoji in any server.",
  },
  {
    icon: <BsLightningChargeFill fontSize={20} />,
    title: "HD streaming",
    text: "Go live in 1080p and 60fps.",
  },
];

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export default function NitroView() {
  const nitro = useHydrateNitro();
  const setNitro = useNitroStore((state) => state.setNitro);
  const active = nitro?.active ?? false;

  return (
    <div className="hover-scrollbar flex w-full flex-col overflow-y-auto pb-8">
      <div className="rounded-lg bg-gradient-to-r from-primary to-[#eb459e] p-6">
        <div className="flex items-center gap-3 text-2xl font-bold text-white">
          <BsGem />
          Nitro
        </div>
        <p className="mt-1 max-w-md text-sm text-white/90">
          Boost servers, upload bigger files and use your emoji everywhere.
        </p>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {benefits.map((benefit) => (
          <div
            key={benefit.title}
            className="flex items-start gap-3 rounded-md border border-gray-800 bg-midground p-4"
          >
            <span className="flex-none text-primary">{benefit.icon}</span>
            <div>
              <p className="text-sm font-semibold text-gray-100">
                {benefit.title}
              </p>
              <p className="mt-0.5 text-xs text-gray-400">{benefit.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-md border border-gray-800 bg-midground p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1">
            <p className="text-base font-semibold text-gray-100">
              Nitro{" "}
              <span className="text-sm font-normal text-gray-400">
                $9.99 / month
              </span>
            </p>
            <p className="mt-0.5 text-xs text-gray-400">
              {active && nitro?.since
                ? `Active since ${formatDate(nitro.since)}. Boost servers from any server page.`
                : "Boost servers from any server page. Cancel any time."}
            </p>
          </div>
          {active ? (
            <Button
              bg={false}
              className="!my-0"
              onClick={() => setNitro({ active: false, since: null })}
            >
              Cancel Nitro
            </Button>
          ) : (
            <Button
              className="!my-0"
              onClick={() =>
                setNitro({ active: true, since: new Date().toISOString() })
              }
            >
              Get Nitro
            </Button>
          )}
        </div>
        <Divider className="my-4 h-[1px] w-full" />
        <p className="text-xs text-gray-500">
          Demo only — no payment is charged. Nitro is remembered in this
          browser.
        </p>
      </div>
    </div>
  );
}
