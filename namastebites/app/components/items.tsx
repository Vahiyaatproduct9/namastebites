import { Item } from "../types/types"
import "./items.css"
type propType = {
  items: Item[];
  Component: React.FC<{ item: Item }>
}
export default (props: propType) => {
  const { items, Component } = props;
  const FoodItems = () => {
    return items.map(item => {
      return (
        <Component key={item.id} item={item} />
      )
    })
  }
  return (
    <div className="items">
      <FoodItems />
    </div>
  )
}