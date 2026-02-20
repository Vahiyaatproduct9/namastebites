import path from "@/app/path/path";
import { exploreItemType, ResponseType } from "@/app/types/types";
type ItemRequestType = {
  single: string;
};
type ListRequestType = {
  limit?: number;
  offset?: number;
};
type ExploreRequestType = ItemRequestType | ListRequestType;
async function explore(props?: ExploreRequestType) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(props || {})) {
    params.append(key, value);
  }
  const response = await fetch(`${path}/explore?${params.toString()}`);
  const data = await response.json();
  return data;
}
export async function getItem(props: ItemRequestType) {
  return (await explore(props)) as ResponseType<{ item: exploreItemType }>;
}

export async function getItems(props?: ListRequestType) {
  return (await explore(props)) as ResponseType<{ items: exploreItemType[] }>;
}
