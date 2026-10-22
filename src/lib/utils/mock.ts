import { User, StaticUserStatuses } from "@/lib/entities/user";
import { ListedDMChannel } from "../entities/channel";

export const MOCK_DELAY = 1000;
/* Row counts used by the loading skeletons. */
export const MOCK_FRIENDS = 18;
export const MOCK_CHANNELS = 18;
export const MOCK_SERVERS = 18;

/*
 * The preview account starts out empty: no friends, no friend requests, no
 * direct messages and no servers. Everything else in the app is content the
 * person using the preview creates themselves (servers are kept in
 * `src/state/server-list.ts`).
 */
export const PREVIEW_CHANNELS: ListedDMChannel[] = [];
export const PREVIEW_FRIENDS: User[] = [];
export const PREVIEW_FRIEND_REQUESTS: User[] = [];
export const PREVIEW_SERVER_CHANNELS: ListedDMChannel[] = [];

export const PREVIEW_STATIC_PARAMS = [
  ...PREVIEW_CHANNELS,
  ...PREVIEW_SERVER_CHANNELS,
].map((channel) => ({ id: channel.id }));

export const PREVIEW_CURRENT_USER: User = {
  id: "100000000000000001",
  name: "Repeep",
  avatar: "https://avatars.githubusercontent.com/u/16727448?v=4",
  status: StaticUserStatuses.DND,
  username: "Reepep",
};

export const getPreviewChannelById = (id: string) =>
  [...PREVIEW_CHANNELS, ...PREVIEW_SERVER_CHANNELS].find(
    (channel) => channel.id === id,
  );

export const generateFakeCurrentUser = () => PREVIEW_CURRENT_USER;
