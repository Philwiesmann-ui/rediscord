"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { ListedServer } from "@/lib/entities/server";
import { clsx } from "@/lib/utils";
import { createDefaultRoles } from "@/lib/utils/permissions";
import { useServerStore } from "@/state/server-list";
import React from "react";
import { BsX } from "react-icons/bs";
import ServerSettingsOverview from "./server-settings-overview";
import ServerSettingsRoles from "./server-settings-roles";

type SettingsTab = "overview" | "roles";

const TABS: { id: SettingsTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "roles", label: "Roles" },
];

interface ServerSettingsDialogProps {
  server: ListedServer;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/*
 * Radix unmounts the content while the dialog is closed, so the selected tab
 * is stored in the panel below and every open starts on the overview again.
 */
function ServerSettingsPanel({
  server,
  onClose,
}: {
  server: ListedServer;
  onClose: () => void;
}) {
  const updateServer = useServerStore((state) => state.updateServer);
  const [tab, setTab] = React.useState<SettingsTab>("overview");

  /*
   * Servers created before role support have no roles yet. The default
   * @everyone role is written back once, on the first open of the settings.
   */
  React.useEffect(() => {
    if (server.roles?.length) {
      return;
    }
    updateServer(server.id, { roles: createDefaultRoles(server.id) });
  }, [server.id, server.roles, updateServer]);

  return (
    <div className="flex h-full w-full">
      <nav className="flex w-40 flex-none flex-col gap-1 bg-semibackground p-3 sm:w-56">
        <p className="truncate px-2 pb-2 text-xs font-semibold uppercase text-gray-400">
          {server.name}
        </p>
        {TABS.map((entry) => (
          <button
            key={entry.id}
            type="button"
            onClick={() => setTab(entry.id)}
            className={clsx(
              "rounded px-2 py-1.5 text-left text-sm transition-colors",
              tab === entry.id
                ? "bg-gray-700/60 text-gray-100"
                : "text-gray-400 hover:bg-gray-800/50 hover:text-gray-200",
            )}
          >
            {entry.label}
          </button>
        ))}
        <button
          type="button"
          onClick={onClose}
          className="mt-auto rounded px-2 py-1.5 text-left text-xs text-gray-400 transition-colors hover:bg-gray-800/50 hover:text-gray-200"
        >
          Close settings (esc)
        </button>
      </nav>

      <div className="flex min-w-0 flex-1 flex-col bg-foreground">
        <div className="flex flex-none items-center justify-between gap-3 px-4 py-5 sm:px-8">
          <h2 className="truncate text-lg font-semibold text-gray-100">
            {tab === "overview" ? "Server overview" : "Roles"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close server settings"
            className="flex-none text-gray-400 transition-colors hover:text-gray-100"
          >
            <BsX fontSize={22} />
          </button>
        </div>
        <div className="hover-scrollbar flex-1 overflow-y-auto px-4 pb-8 sm:px-8">
          {tab === "overview" ? (
            <ServerSettingsOverview server={server} />
          ) : (
            <ServerSettingsRoles server={server} />
          )}
        </div>
      </div>
    </div>
  );
}

export default function ServerSettingsDialog({
  server,
  open,
  onOpenChange,
}: ServerSettingsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="!flex !h-[85vh] !max-w-[960px] !gap-0 !overflow-hidden !rounded-lg !border !border-gray-800 !bg-midground !p-0"
        aria-describedby="server-settings-description"
      >
        <DialogTitle className="sr-only">
          Server settings for {server.name}
        </DialogTitle>
        <DialogDescription
          id="server-settings-description"
          className="sr-only"
        >
          Change the overview and the roles of {server.name}.
        </DialogDescription>
        <ServerSettingsPanel
          server={server}
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
