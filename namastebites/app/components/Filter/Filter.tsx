import { Category, FilterType, SortType } from "@/app/types/types";
import "./filter.css";
import React, { SetStateAction, useEffect } from "react";
import categoryIdToValue from "@/app/data/categories";
const Filter = (props: {
  applySearch: () => void;
  applyFilter: () => Promise<void>;
  setFilterShown: React.Dispatch<React.SetStateAction<boolean>>;
  setFilters: React.Dispatch<React.SetStateAction<FilterType[]>>;
  setSorting: React.Dispatch<React.SetStateAction<SortType | null>>;
  sorting: SortType | null;
  filteredList: FilterType[];
}) => {
  const setSort = (id: string, desc: boolean) => {
    props.setSorting({ id, desc });
  };
  useEffect(() => {
    console.log("filtered list: ", props.filteredList);
    console.log("sorting: ", props.sorting);
  }, [props.filteredList, props.sorting]);
  const clearFilters = () => {
    props.setFilters([]);
    props.setSorting(null);
  };
  const sortValue =
    props.sorting?.desc === true
      ? "desc"
      : props.sorting?.desc === false
        ? "asc"
        : "";

  const clickApply = () => {
    props.setFilterShown(false);
    props.applyFilter();
  };
  const clickReset = () => {
    clearFilters();
  };
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
              <CategoryList
                filteredList={props.filteredList}
                setFilteredList={props.setFilters}
              />
            </div>
          </div>
          <DietList
            filteredList={props.filteredList}
            setFilteredList={props.setFilters}
          />
          <div className="filter-header">
            <h1>Sort By</h1>
          </div>
          <div className="filter-item">
            <label htmlFor="price">Price</label>
            <select
              name="price"
              id="price"
              onChange={(e) => {
                if (e.target.value === "") {
                  props.setSorting(null);
                } else {
                  setSort("price", e.target.value === "desc");
                }
              }}
              value={sortValue}
            >
              <option value="">All</option>
              <option value={"desc"}>High to Low</option>
              <option value={"asc"}>Low to High</option>
            </select>
          </div>
        </div>
        <div className="filter-footer">
          <button className="reset-button" onClick={clickReset}>
            Reset
          </button>
          <button className="apply-button" onClick={clickApply}>
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};
const CategoryList = (props: {
  filteredList: FilterType[];
  setFilteredList: React.Dispatch<SetStateAction<FilterType[]>>;
}) => {
  const handleClick = (categoryId: string) => {
    console.log("click!!");
    // if filtered lIST IS empty, create a new filter object
    const categoryList = props.filteredList.find(
      (item) => item.id === "category",
    );
    if (!categoryList) {
      props.setFilteredList([
        {
          id: "category",
          value: [categoryId],
          type: "multi-select",
        },
      ]);
      return;
    }
    const categoryValue = [...(categoryList.value as string[])];

    props.setFilteredList((prev) => {
      const prevState = prev.filter((t) => t.id !== "category");
      const updatedCategoryValue = categoryValue.includes(categoryId)
        ? categoryValue.filter((t) => t !== categoryId)
        : [...categoryValue, categoryId];
      const newCategoryFilter: FilterType = {
        id: "category",
        type: "multi-select",
        value: updatedCategoryValue,
      };
      return [...prevState, newCategoryFilter];
    });
  };
  return categoryIdToValue.map((category) => {
    const isSelected = props.filteredList.find((item) =>
      (item.value as string[]).includes(category.id),
    );
    return (
      <div key={category.value} className="category-item">
        <button
          onClick={() => handleClick(category.id)}
          className={`category-button ${isSelected ? "button-selected" : ""}`}
        >
          {category.value}
        </button>
      </div>
    );
  });
};

const DietList = (props: {
  filteredList: FilterType[];
  setFilteredList: React.Dispatch<SetStateAction<FilterType[]>>;
}) => {
  const handleSelect = (diet: "all" | "veg" | "non-veg") => {
    props.setFilteredList((prev) => {
      if (diet === "all") {
        return prev.filter((t) => t.id !== "diet");
      }
      if (diet === "veg" || diet === "non-veg") {
        const prevState = prev.filter((t) => t.id !== "diet");
        const newDietFilter: FilterType = {
          id: "diet",
          type: "single-select",
          value: diet,
        };
        return [...prevState, newDietFilter];
      } else {
        return prev;
      }
    });
  };
  return (
    <div className="filter-item">
      <label htmlFor="diet">Diet</label>
      <select
        name="diet"
        id="diet"
        value={
          (props.filteredList.find((item) => item.id === "diet")?.value as
            | "all"
            | "veg"
            | "non-veg"
            | undefined) || "all"
        }
        onChange={(e) =>
          handleSelect(e.target.value as "all" | "veg" | "non-veg")
        }
      >
        <option value="all">All</option>
        <option value="veg">Vegetarian</option>
        <option value="non-veg">Non-Vegetarian</option>
      </select>
    </div>
  );
};

export default Filter;
