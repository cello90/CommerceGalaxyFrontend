export type Recipe = {
  _id: string;
  name: string;
  symbol: string;
  time: number;
  amount: number;
  type: string;
  resource: {
    _id: string;
    name: string;
  };
  catalog: {
    _id: string;
    name: string;
    size: number;
    type: string;
  };
};
