export type Base = {
  _id: string;
  name: string;
  size: number;
  planet: {
    _id: string;
    name: string;
  };
  user: {
    _id: string;
    username: string;
  } | null;
};

export type Planet = {
  _id: string;
  name: string;
};

export type Building = {
  _id: string;
  name: string;
  size: number;
  type: string;
  base: Base;
};
