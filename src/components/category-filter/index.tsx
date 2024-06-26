import { ICategoryData } from "@/types/category";
import { FC } from "react";
import SubCategory from "./sub-category";

interface IProps {
  categoryFilterItems: ICategoryData[];
  handleMultipleCategory: (title: string, removeUnselected: boolean) => void;
  activeCategories:string[]
}

const CategoryFilter: FC<IProps> = ({
  categoryFilterItems,
  handleMultipleCategory,
  activeCategories
}) => {
  return (
    <>
      {categoryFilterItems
        .filter(
          (category) =>
            category.parent_category === "0" ||
            category.parent_category === null ||
            category.parent_category === ""
        )
        .map((rootCategory) => {
          return (
            <SubCategory
              key={rootCategory.title}
              categoryFilterItems={categoryFilterItems}
              rootCategory={rootCategory}
              handleMultipleCategory={handleMultipleCategory}
              activeCategories={activeCategories}
            />
          );
        })}
    </>
  );
};

export default CategoryFilter;
