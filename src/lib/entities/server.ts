export type ServerChannel = {
  id: string;
  name: string;
};

export type ListedServer = {
  id: string;
  name: string;
  photo: string;
  messages?: number;
  channels?: ServerChannel[];
};
