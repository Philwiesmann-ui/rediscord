"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import ServerIconPicker from "@/components/islets/server-icon-picker";
import { ListedServer, ServerChannel } from "@/lib/entities/server";
import { useServerStore } from "@/state/server-list";
import { useRouter } from "next/navigation";
import React from "react";

interface CreateServerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const createId = () => Math.random().toString(36).slice(2, 10);

const parseChannelNames = (value: string): string[] => {
  const names = value
    .split(/[,\n]/)
    .map((name) => name.trim().replace(/\s+/g, "-").toLowerCase())
    .filter(Boolean);
  const uniqueNames = Array.from(new Set(names));
  return uniqueNames.length ? uniqueNames : ["general"];
};

export default function CreateServerDialog({
  open,
  onOpenChange,
}: CreateServerDialogProps) {
  const { addServer } = useServerStore();
  const router = useRouter();
  const [name, setName] = React.useState("");
  const [photo, setPhoto] = React.useState("");
  const [channelNames, setChannelNames] = React.useState("general");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const serverName = name.trim();
    if (!serverName) {
      return;
    }

    const id = `server-${createId()}`;
    const channels: ServerChannel[] = parseChannelNames(channelNames).map(
      (channelName, index) => ({ id: `${id}-${index}`, name: channelName }),
    );
    const server: ListedServer = {
      id,
      name: serverName,
      photo: photo.trim(),
      channels,
    };

    addServer(server);
    setName("");
    setPhoto("");
    setChannelNames("general");
    onOpenChange(false);
    router.push(`/servers/${id}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showClose className="border-[1px] border-gray-800">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create a server</DialogTitle>
            <DialogDescription className="text-gray-400">
              Your server is where you and your people hang out. Give it a name,
              a picture and its first channels.
            </DialogDescription>
          </DialogHeader>
          <label className="flex flex-col gap-1 text-xs font-semibold uppercase text-gray-400">
            Server name
            <Input
              className="mt-1 text-sm normal-case text-gray-100"
              placeholder="My server"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </label>
          <ServerIconPicker name={name} photo={photo} onChange={setPhoto} />
          <label className="flex flex-col gap-1 text-xs font-semibold uppercase text-gray-400">
            Channels (comma separated)
            <Input
              className="mt-1 text-sm normal-case text-gray-100"
              placeholder="general, off-topic"
              value={channelNames}
              onChange={(event) => setChannelNames(event.target.value)}
            />
          </label>
          <DialogFooter>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded px-3 py-2 text-sm text-gray-300 hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="rounded bg-primary px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/80 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Create server
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
