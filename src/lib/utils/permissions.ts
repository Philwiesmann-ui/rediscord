import { ListedServer, ServerRole } from "@/lib/entities/server";

export type ServerPermission = {
  key: string;
  label: string;
  description: string;
};

export type PermissionGroup = {
  label: string;
  permissions: ServerPermission[];
};

export const PERMISSION_GROUPS: PermissionGroup[] = [
  {
    label: "General Server Permissions",
    permissions: [
      {
        key: "ADMINISTRATOR",
        label: "Administrator",
        description:
          "Members with this permission have every permission and bypass all channel specific permissions.",
      },
      {
        key: "VIEW_CHANNELS",
        label: "View Channels",
        description: "Members can see the channels of this server.",
      },
      {
        key: "MANAGE_CHANNELS",
        label: "Manage Channels",
        description: "Members can create, edit and delete channels.",
      },
      {
        key: "MANAGE_ROLES",
        label: "Manage Roles",
        description: "Members can create and edit roles below their own.",
      },
      {
        key: "MANAGE_SERVER",
        label: "Manage Server",
        description:
          "Members can change the name, the icon and the settings of this server.",
      },
    ],
  },
  {
    label: "Membership Permissions",
    permissions: [
      {
        key: "CREATE_INVITE",
        label: "Create Invite",
        description: "Members can invite new people to this server.",
      },
      {
        key: "CHANGE_NICKNAME",
        label: "Change Nickname",
        description: "Members can change their own nickname.",
      },
      {
        key: "MANAGE_NICKNAMES",
        label: "Manage Nicknames",
        description: "Members can change the nickname of other members.",
      },
      {
        key: "KICK_MEMBERS",
        label: "Kick Members",
        description: "Members can remove other members from this server.",
      },
      {
        key: "BAN_MEMBERS",
        label: "Ban Members",
        description: "Members can permanently ban other members.",
      },
    ],
  },
  {
    label: "Text Channel Permissions",
    permissions: [
      {
        key: "SEND_MESSAGES",
        label: "Send Messages",
        description: "Members can write messages in text channels.",
      },
      {
        key: "EMBED_LINKS",
        label: "Embed Links",
        description: "Links that members post show a preview.",
      },
      {
        key: "ATTACH_FILES",
        label: "Attach Files",
        description: "Members can upload files and images.",
      },
      {
        key: "ADD_REACTIONS",
        label: "Add Reactions",
        description: "Members can add new emoji reactions.",
      },
      {
        key: "READ_MESSAGE_HISTORY",
        label: "Read Message History",
        description: "Members can read the older messages of a channel.",
      },
      {
        key: "MANAGE_MESSAGES",
        label: "Manage Messages",
        description:
          "Members can delete and pin the messages of other members.",
      },
      {
        key: "MENTION_EVERYONE",
        label: "Mention @everyone, @here and All Roles",
        description: "Members can mention everyone in this server.",
      },
    ],
  },
  {
    label: "Voice Channel Permissions",
    permissions: [
      {
        key: "CONNECT",
        label: "Connect",
        description: "Members can join voice channels.",
      },
      {
        key: "SPEAK",
        label: "Speak",
        description: "Members can talk in voice channels.",
      },
      {
        key: "STREAM",
        label: "Video",
        description: "Members can share their screen or their camera.",
      },
      {
        key: "MUTE_MEMBERS",
        label: "Mute Members",
        description: "Members can mute other members in voice channels.",
      },
      {
        key: "DEAFEN_MEMBERS",
        label: "Deafen Members",
        description: "Members can deafen other members in voice channels.",
      },
      {
        key: "MOVE_MEMBERS",
        label: "Move Members",
        description: "Members can move other members between voice channels.",
      },
      {
        key: "PRIORITY_SPEAKER",
        label: "Priority Speaker",
        description: "Members keep their volume when someone else talks.",
      },
    ],
  },
];

const DEFAULT_EVERYONE_PERMISSIONS = [
  "VIEW_CHANNELS",
  "SEND_MESSAGES",
  "EMBED_LINKS",
  "ATTACH_FILES",
  "ADD_REACTIONS",
  "READ_MESSAGE_HISTORY",
  "CREATE_INVITE",
  "CHANGE_NICKNAME",
  "CONNECT",
  "SPEAK",
  "STREAM",
];

/* The swatches Discord offers in its role colour picker. */
export const ROLE_COLORS = [
  "#1abc9c",
  "#2ecc71",
  "#3498db",
  "#9b59b6",
  "#e91e63",
  "#f1c40f",
  "#e67e22",
  "#e74c3c",
  "#95a5a6",
  "#607d8b",
  "#11806a",
  "#1f8b4c",
  "#206694",
  "#71368a",
  "#ad1457",
  "#c27c0e",
  "#a84300",
  "#992d22",
];

export const everyoneRoleId = (serverId: string) => `${serverId}-everyone`;

export const isEveryoneRole = (role: ServerRole) =>
  role.name === "@everyone";

/*
 * Every server starts with the @everyone role, which cannot be deleted.
 */
export const createDefaultRoles = (serverId: string): ServerRole[] => [
  {
    id: everyoneRoleId(serverId),
    name: "@everyone",
    color: "",
    hoist: false,
    mentionable: false,
    permissions: [...DEFAULT_EVERYONE_PERMISSIONS],
  },
];

/*
 * Servers created before role support have no `roles` key yet, so they fall
 * back to the default set until the settings dialog writes it back.
 */
export const getServerRoles = (server: ListedServer): ServerRole[] =>
  server.roles?.length ? server.roles : createDefaultRoles(server.id);
