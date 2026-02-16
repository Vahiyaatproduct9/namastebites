import Item from "../item/[item]/page";

export type Item = {
  id: string;
  name: string;
  price: number;
  url: string;
};
export enum Category {
  APPETIZER = "appetizer",
  MAIN_COURSE = "main_course",
  DESSERT = "dessert",
  BEVERAGE = "beverage",
  SIDE_DISH = "side_dish",
}
export type exploreItemType = {
  item_id: number;
  name: string;
  category: Category;
  description: string;
  price: string;
  image_url: string;
  active: boolean;
  order_frequency: number;
};

export type Food = Item & {
  quantity: number;
};

export type CartItem = Omit<Item, "url" | "price" | "name"> & {
  quantity: number;
};

export type PaymentPostBodyType = {
  amount: number;
  currency: string;
  receipt: string;
  notes?: Record<string, string>;
};

export type ResponseType<T> = {
  status: number;
  message: string;
  error?: string;
  data: T | null;
};
