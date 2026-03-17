import path from "@/app/path/path";
import {
  exploreItemType,
  FilterType,
  SortType,
} from "@/app/types/types";
import withResult from "../../internal/withResult";
type ItemRequestType = {
  single: string;
};
type ListRequestType = {
  filter?: FilterType[];
  sorting?: SortType | null;
  limit?: number | null;
  offset?: number | null;
  globalSearch?: string | null;
};
type ExploreRequestType = ItemRequestType | ListRequestType;
async function explore(props?: ExploreRequestType) {
  const response = await withResult(fetch(`${path}/explore`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(props),
  }));
  return response;
}
export async function getItem(props: ItemRequestType) {
  return (await explore(props)) as { item: exploreItemType };
}

export async function getItems(props?: ListRequestType) {
  return (await explore(props)) as { items: exploreItemType[] };
}
