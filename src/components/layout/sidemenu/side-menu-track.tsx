"use client";
import React, { useState } from "react";
import { ListedServer } from "@/lib/entities/server";
import SideMenuItem from "./side-menu-item";
import { clsx } from "@/lib/utils";
import { BsDiscord, BsPlus } from "react-icons/bs";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import Divider from "@/components/ui/divider";
import { useHydrateServers } from "@/state/server-list";
import { usePathname } from "next/navigation";
import CreateServerDialog from "./create-server-dialog";

type ServerMenuItemProps = {
  server: ListedServer;
  isActive: boolean;
} & React.ComponentProps<typeof SideMenuItem>;

const ServerMenuItem = ({
  server,
  isActive,
  ...props
}: Omit<ServerMenuItemProps, "tooltipContent">) => {
  return (
    <SideMenuItem
      isActive={isActive}
      notificationCount={server.messages}
      tooltipContent={<div className="font-semibold">{server.name}</div>}
      className="mx-auto my-2"
      image={
        server.photo
          ? {
              url: server.photo,
              alt: server.name,
            }
          : undefined
      }
      {...props}
    >
      {!server.photo && (
        <span className="text-base font-semibold text-gray-200">
          {server.name.charAt(0).toUpperCase()}
        </span>
      )}
    </SideMenuItem>
  );
};

export default function SideMenuTrack() {
  const servers = useHydrateServers();
  const pathname = usePathname();
  const [createOpen, setCreateOpen] = useState(false);

  const activeServer = servers?.find(
    (server) => pathname === `/servers/${server.id}`,
  );

  return (
    <>
      <TooltipProvider>
        {/*
          Direct messages side menu button
        */}
        <SideMenuItem
          href="/channels/me"
          tooltipContent={<div className="font-semibold">Direct messages</div>}
          className={clsx(
            "mx-auto mb-2 flex items-center justify-center bg-foreground",
            !activeServer ? "bg-primary text-white" : "text-gray-300",
          )}
          isActive={!activeServer}
        >
          <BsDiscord fontSize={26} />
        </SideMenuItem>

        <Divider className="w-8" />

        {/*
          List of servers created in the preview
        */}
        {servers?.map((server) => (
          <ServerMenuItem
            href={`/servers/${server.id}`}
            key={server.id}
            server={server}
            isActive={activeServer?.id === server.id}
          />
        ))}

        {/*
          Create a server
        */}
        <SideMenuItem
          onClick={() => setCreateOpen(true)}
          tooltipContent={<div className="font-semibold">Add a server</div>}
          className="mx-auto my-2 flex items-center justify-center bg-foreground text-green-500 hover:text-white"
        >
          <BsPlus fontSize={26} />
        </SideMenuItem>
      </TooltipProvider>
      <CreateServerDialog open={createOpen} onOpenChange={setCreateOpen} />
    </>
  );
}
