"use client";
import ServerIconPicker from "@/components/islets/server-icon-picker";
import { Input } from "@/components/ui/input";
import { ListedServer, ServerChannel } from "@/lib/entities/server";
import { useServerStore } from "@/state/server-list";
import React from "react";
import { BsPlus, BsX } from "react-icons/bs";

const createChannelId = () => Math.random().toString(36).slice(2, 10);

export default function ServerSettingsOverview({
  server,
}: {
  server: ListedServer;
}) {
  const updateServer = useServerStore((state) => state.updateServer);
  const [name, setName] = React.useState(server.name);
  const [photo, setPhoto] = React.useState(server.photo);
  const [newChannel, setNewChannel] = React.useState("");

  const channels = server.channels ?? [];

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const serverName = name.trim();
    if (!serverName) {
      return;
    }
    updateServer(server.id, { name: serverName, photo: photo.trim() });
  };

  const handleAddChannel = () => {
    const channelName = newChannel.trim().replace(/\s+/g, "-").toLowerCase();
    if (!channelName) {
      return;
    }
    const channel: ServerChannel = {
      id: `${server.id}-${createChannelId()}`,
      name: channelName,
    };
    updateServer(server.id, { channels: [...channels, channel] });
    setNewChannel("");
  };

  const handleDeleteChannel = (channelId: string) => {
    updateServer(server.id, {
      channels: channels.filter((channel) => channel.id !== channelId),
    });
  };

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
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

      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase text-gray-400">
          Text channels
        </span>
        <ul className="flex flex-col gap-1">
          {channels.map((channel) => (
            <li
              key={channel.id}
              className="flex items-center justify-between rounded bg-midground px-3 py-2 text-sm text-gray-100"
            >
              <span className="truncate"># {channel.name}</span>
              <button
                type="button"
                onClick={() => handleDeleteChannel(channel.id)}
                aria-label={`Delete channel ${channel.name}`}
                className="text-gray-400 transition-colors hover:text-red-400"
              >
                <BsX fontSize={18} />
              </button>
            </li>
          ))}
          {!channels.length && (
            <li className="text-sm text-gray-400">No channels yet.</li>
          )}
        </ul>
        <div className="flex items-center gap-2">
          <Input
            aria-label="New channel name"
            className="text-sm text-gray-100"
            placeholder="new-channel"
            value={newChannel}
            onChange={(event) => setNewChannel(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                handleAddChannel();
              }
            }}
          />
          <button
            type="button"
            onClick={handleAddChannel}
            disabled={!newChannel.trim()}
            className="flex flex-none items-center gap-1 rounded bg-gray-700 px-3 py-2 text-xs font-semibold text-gray-100 transition-colors hover:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <BsPlus fontSize={16} />
            Add channel
          </button>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={!name.trim()}
          className="rounded bg-primary px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#4751be] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Save changes
        </button>
      </div>
    </form>
  );
}
