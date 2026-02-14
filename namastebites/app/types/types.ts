export type Item = {
  id: string;
  name: string;
  price: number;
  url: string;
}

export type Food = Item & {
  quantity: number
}