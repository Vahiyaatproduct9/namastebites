import path from "@/app/path/path";
import {
  exploreItemType,
  FilterType,
  ResponseType,
  SortType,
} from "@/app/types/types";
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
  // const info = {
  //   single: null,
  //   sorting: null,
  //   limit: null,
  //   offset: null,
  //   globalSearch: null,
  //   ...props,
  // };
  const response = await fetch(`${path}/explore`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(props),
  });
  const data = await response.json();
  return data;
}
export async function getItem(props: ItemRequestType) {
  return (await explore(props)) as ResponseType<{ item: exploreItemType }>;
}

export async function getItems(props?: ListRequestType) {
  return (await explore(props)) as ResponseType<{ items: exploreItemType[] }>;
}
