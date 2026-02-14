import { Food } from "../types/types"
import "./items.css"

type propType = {
  items: Food[];
  Component: React.FC<{ item: Food }>;
  className?: string;
}
const Items = (props: propType) => {
  const { items, Component } = props;

  const FoodItems = () => {
    return items.map(item => {
      return (
        <Component key={item.id} item={item} />
      )
    })
  }
  return (
    <div className={`items ${props.className || ''}`}>
      {/* eslint-disable-next-line react-hooks/static-components */}
      {items.length > 0 ? <FoodItems /> : <div>No items found</div>}
    </div>
  )
}

export default Items;