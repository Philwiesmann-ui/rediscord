export type ServerChannel = {
  id: string;
  name: string;
};

export type ServerRole = {
  id: string;
  name: string;
  /* Hex colour like "#5865f2"; an empty string means the default role colour. */
  color: string;
  /* Display role members separately from online members. */
  hoist: boolean;
  mentionable: boolean;
  permissions: string[];
};

export type ListedServer = {
  id: string;
  name: string;
  photo: string;
  messages?: number;
  channels?: ServerChannel[];
  boosts?: number;
  roles?: ServerRole[];
};
