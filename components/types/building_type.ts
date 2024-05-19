import { Base } from "./base_type";
import { CatalogItem } from "./catalog_type";
import { Recipe } from "./recipe_type";

export type Building = {
  _id: string;
  catalog: CatalogItem;
  base: Base;
  producing: Recipe | null;
  startTime: Date;
  queue: Recipe[];
};
