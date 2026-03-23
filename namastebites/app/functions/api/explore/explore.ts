import { APICall } from "../apiClient";
import { exploreItemType, FilterType, SortType } from "@/app/types/types";
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

export async function getItem(props: ItemRequestType) {
  return (await APICall("/explore", {
    method: "POST",
    body: props,
  })) as { item: exploreItemType };
}

export async function getItems(props?: ListRequestType) {
  return (await APICall("/explore", {
    method: "POST",
    body: props,
  })) as { items: exploreItemType[] };
}
