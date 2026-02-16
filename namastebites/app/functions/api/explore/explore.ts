import path from "@/app/path/path";
import { exploreItemType, ResponseType } from "@/app/types/types";

export async function getItems(): Promise<
  ResponseType<{ items: exploreItemType[] }>
> {
  const response = await fetch(`${path}/explore`);
  const data = await response.json();
  return data as ResponseType<{ items: exploreItemType[] }>;
}
