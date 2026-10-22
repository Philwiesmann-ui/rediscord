"use client";
import { Page, PageContent, PageHeader } from "@/components/layout/page";
import { ChatDM } from "@/components/islets/dm-chat";
import ServerBoost from "@/components/islets/server-boost";
import ServerIconDialog from "@/components/islets/server-icon-dialog";
import Avatar from "@/components/ui/avatar";
import Divider from "@/components/ui/divider";
import { Input } from "@/components/ui/input";
import InputField from "@/components/ui/input/input-field";
import { clsx } from "@/lib/utils";
import { useHydrateServers } from "@/state/server-list";
import { useCurrentUserStore } from "@/state/user";
import Link from "next/link";
import React from "react";
import {
  AiFillGift,
  AiFillPlusCircle,
  AiOutlineFileText,
  AiOutlineGif,
} from "react-icons/ai";
import { BsHash, BsPencilSquare } from "react-icons/bs";
import { CgSmileMouthOpen } from "react-icons/cg";

interface Message {
  id: number;
  userId?: string;
  text: string;
  timestamp: string;
}

export default function ServerView({ id }: { id: string }) {
  const servers = useHydrateServers();
  const { currentUser } = useCurrentUserStore();
  const [activeChannelId, setActiveChannelId] = React.useState<string | null>(
    null,
  );
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [newMessage, setNewMessage] = React.useState("");
  const [iconOpen, setIconOpen] = React.useState(false);

  if (servers === null) {
    return (
      <Page>
        <PageContent>
          <div className="p-4 text-sm text-gray-400">Loading server…</div>
        </PageContent>
      </Page>
    );
  }

  const server = servers.find((entry) => entry.id === id);

  if (!server) {
    return (
      <Page>
        <PageContent className="flex-col items-start gap-3 pt-8">
          <p className="text-base text-gray-300">
            This server is not part of your account any more.
          </p>
          <Link
            href="/channels/me"
            className="text-sm text-primary hover:underline"
          >
            Back to friends
          </Link>
        </PageContent>
      </Page>
    );
  }

  const channels = server.channels ?? [];
  const activeChannel =
    channels.find((channel) => channel.id === activeChannelId) ?? channels[0];

  const handleSubmit = () => {
    const text = newMessage.trim();
    if (!text) {
      return;
    }
    setMessages((previousMessages) => [
      ...previousMessages,
      {
        id: previousMessages.length + 1,
        userId: currentUser?.id,
        text,
        timestamp: new Date().toISOString(),
      },
    ]);
    setNewMessage("");
  };

  return (
    <Page>
      <PageHeader>
        <div className="flex flex-none items-center gap-3 text-sm font-semibold">
          <Avatar size="sm" src={server.photo} alt={server.name} />
          {server.name}
          <button
            type="button"
            onClick={() => setIconOpen(true)}
            title="Change server icon"
            aria-label="Change server icon"
            className="text-gray-500 transition-colors hover:text-gray-200"
          >
            <BsPencilSquare fontSize={16} />
          </button>
        </div>
      </PageHeader>
      <PageContent className="flex-col gap-4 pt-4 lg:flex-row">
        <div className="flex w-full flex-none flex-col lg:w-56">
          <ServerBoost server={server} />
          <p className="mb-2 text-xs font-semibold uppercase text-gray-400">
            Text Channels
          </p>
          <ul className="flex flex-col gap-1">
            {channels.map((channel) => (
              <li key={channel.id}>
                <button
                  onClick={() => {
                    setActiveChannelId(channel.id);
                    setMessages([]);
                  }}
                  className={clsx(
                    "flex w-full items-center gap-1.5 rounded px-2 py-1.5 text-left text-sm transition-colors",
                    activeChannel?.id === channel.id
                      ? "bg-gray-700/60 text-gray-100"
                      : "text-gray-400 hover:bg-gray-800/50 hover:text-gray-200",
                  )}
                >
                  <BsHash className="flex-none" />
                  <span className="truncate">{channel.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        <Divider vertical className="hidden lg:block" />
        <div className="relative flex min-h-[60vh] flex-1 flex-col">
          {activeChannel ? (
            <>
              <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-100">
                <BsHash />
                {activeChannel.name}
              </div>
              <Divider className="mt-3 h-[1px] w-full" />
              <div className="max-h-[70vh] flex-1 overflow-y-auto pb-20">
                <ChatDM
                  messages={messages}
                  user={null}
                  currentUser={currentUser}
                />
              </div>
              <InputField
                startIcon={
                  <AiFillPlusCircle
                    className="cursor-pointer hover:text-gray-200"
                    size={22}
                  />
                }
                endIcon={
                  <div className="flex items-center space-x-2.5 text-gray-400">
                    <AiFillGift className="hover:text-gray-300" size={22} />
                    <AiOutlineGif className="hover:text-gray-300" size={22} />
                    <AiOutlineFileText
                      className="hover:text-gray-300"
                      size={22}
                    />
                    <CgSmileMouthOpen
                      className="hover:text-gray-300"
                      size={22}
                    />
                  </div>
                }
                className="!absolute bottom-0 left-0 right-0 !z-[10] w-auto bg-foreground"
              >
                <Input
                  className="py-2 pl-12 pr-36 !placeholder-gray-600"
                  type="text"
                  placeholder={`Message #${activeChannel.name}`}
                  value={newMessage}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      handleSubmit();
                    }
                  }}
                  onChange={(event) => setNewMessage(event.target.value)}
                />
              </InputField>
            </>
          ) : (
            <p className="text-sm text-gray-400">
              This server has no channels yet.
            </p>
          )}
        </div>
      </PageContent>
      <ServerIconDialog
        server={server}
        open={iconOpen}
        onOpenChange={setIconOpen}
      />
    </Page>
  );
}
