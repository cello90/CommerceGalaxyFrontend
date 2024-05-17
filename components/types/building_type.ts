import { Base } from "./base_type";
import { CatalogItem } from "./catalog_type";

export type Building = {
  _id: string;
  catalog: CatalogItem;
  base: Base;
};
