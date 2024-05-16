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
