import Item from "../item/[item]/page";

export type JsonResponse = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  status: number;
  success: boolean;
  message: string;
  provider: "Namaste Bites :)";
};
export type RazorPayVerify = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};
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

export type CartItem = Omit<Item, "url"> & {
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

export type FilterType = {
  id: string;
  value: string | Date[] | number[] | string[] | number;
  type: "multi-select" | "global-search" | "date" | "range" | "single-select";
};

export type SortType = {
  id: string;
  desc: boolean;
};

export type LocationType = {
  id: string;
  address: string;
  city: string;
  landmark: string;
  lat?: number;
  lng?: number;
};
