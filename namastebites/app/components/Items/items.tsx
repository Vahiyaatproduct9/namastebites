import { Food } from "../../types/types";
import "./items.css";

type propType = {
  items: Food[];
  Component: React.FC<{ item: Food }>;
  className?: string;
};
const Items = (props: propType) => {
  const { items, Component } = props;

  return (
    <div className={`items ${props.className || ""}`}>
      {/* eslint-disable-next-line react-hooks/static-components */}
      {items.length > 0 ? (
        <FoodItems items={items} Component={Component} />
      ) : (
        <div className="h-full flex items-center justify-center">
          No items found
        </div>
      )}
    </div>
  );
};

const FoodItems = (props: {
  items: Food[];
  Component: React.FC<{ item: Food }>;
}) => {
  return props.items.map((item) => {
    return <props.Component key={item.id} item={item} />;
  });
};

export default Items;
