import GradientCategorySelectorButton from "./GradientCategorySelectorButton";
import selectorStyle from "./category-selector.module.css";

export default function GradientCategorySelector() {
  return (
    <div className={`${selectorStyle.grid}`}>
      {(["widget", "page", "pageMinimal"] as GradientCategory[]).map(
        (category, index) => {
          return (
            <GradientCategorySelectorButton
              key={index}
              {...{ index, category }}
            />
          );
        }
      )}
    </div>
  );
}
