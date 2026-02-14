import Items from "../components/items"
import { Item } from "../types/types";
import "./explore.css"
export default () => {
  const items: Item[] = [];
  for (let i = 0; i < 5; i++) {
    items.push({
      id: i.toString(),
      name: "Item " + i,
      price: i * 10,
      url: 'https://picsum.photos/seed/1234/400/400'
    })
  }
  return (
    <div className="explore-container">
      <div className="explore">
        <div className="explore-header">
          <h1 className="explore-text">Explore</h1>
        </div>
        <div className="explore-search">
          <input type="text" placeholder="Search" />
        </div>
        <div className="explore-body">
          <Items items={items} Component={({ item }) => {
            return (
              <div className="item-body">
                {item.name}
              </div>
            )
          }} />
        </div>
      </div>
    </div>
  )
}