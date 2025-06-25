import React, { useState } from "react";
import "./CategoryBar.css";

const CategoryBar = ({ onCategoryChange }) => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const handleCategorySelection = (event) => {
    const selectedCategoryOrder = event.target.value;
    setSelectedCategory(selectedCategoryOrder); // 選択されたカテゴリを更新
    onCategoryChange(selectedCategoryOrder); // 親コンポーネントに変更を通知
  };

  return (
    <div className="category-bar">
      <select onChange={handleCategorySelection} value={selectedCategory}>
        <option value="all">全一覧</option>
        <option value="long_term">長期的</option>
        <option value="short_term">短期的</option>
        <option value="free">フリー</option>
      </select>
    </div>
  );
};

export default CategoryBar;
