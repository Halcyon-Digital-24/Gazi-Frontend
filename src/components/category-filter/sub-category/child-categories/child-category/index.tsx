import { ICategoryData } from "@/types/category";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import "./index.scss";

interface IProps {
  childCategory: ICategoryData;
  subCategory: ICategoryData;
  rootCategoryChanged: string;
  setRootCategoryChanged: Dispatch<SetStateAction<string>>;
  handleMultipleCategory: (title: string, removeUnselected: boolean) => void;
}

const ChildCategory: FC<IProps> = ({
  subCategory,
  childCategory,
  rootCategoryChanged,
  setRootCategoryChanged,
  handleMultipleCategory,
}) => {
  const [checked, setChecked] = useState<boolean>(false);

  const onChangeHandler = (event: any) => {
    handleMultipleCategory(event.target.value, false);
    setChecked((prevState) => !prevState);
    setRootCategoryChanged(subCategory.slug);
  };

  useEffect(() => {
    if (rootCategoryChanged !== subCategory.slug) {
      if (checked) {
        setChecked(false);
        handleMultipleCategory(childCategory.title, true);
      }
    }
  }, [rootCategoryChanged]);

  return (
    <div className="childCategory">
      <input
        className="childCategory-checkbox"
        type="checkbox"
        checked={checked}
        onChange={onChangeHandler}
        value={childCategory.title}
        style={{ marginInline: 10 }}
      />
      {childCategory.title}
    </div>
  );
};

export default ChildCategory;