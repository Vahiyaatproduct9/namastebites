import { FilterType } from "@/app/types/types";
import "./filter.css";
const Filter = (props: {
  setFilterShown: React.Dispatch<React.SetStateAction<boolean>>;
  setFilters: React.Dispatch<React.SetStateAction<FilterType>>;
}) => {
  const categoryList = [
    "Snacks",
    "Main Course",
    "Desserts",
    "Drinks",
    "Breakfast",
    "Side Dish",
    "Appetizer",
  ];

    return (
      <div className="filter-body" onClick={() => props.setFilterShown(false)}>
        <div className="filter-container" onClick={(e) => e.stopPropagation()}>
          <div className="filter-header">
            <h1>Filter</h1>
          </div>
          <div className="filter-content">
            <div className="filter-item">
              <h3>Category</h3>
              <div className="category-list">
                <CategoryList categorylist={categoryList}/>
              </div>
            </div>
            <div className="filter-item">
              <label htmlFor="diet">Diet</label>
              <select name="diet" id="diet">
                <option value="all">All</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="non-vegetarian">Non-Vegetarian</option>
                <option value="vegan">Vegan</option>
              </select>
            </div>
            <div className="filter-item">
              <label htmlFor="price">Price</label>
              <select name="price" id="price">
                <option value="all">All</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    )
}
  const CategoryList = (props: {categorylist: string[]}) => {
    return props.categorylist.map((category) => {
      return <div key={category}>{category}</div>;
    });
  };

export default Filter; 