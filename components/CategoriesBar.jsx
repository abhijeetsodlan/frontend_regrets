// src/components/CategoriesBar.jsx
import React from "react";

const CategoriesBar = ({ categories, selectedCategory, onCategoryClick }) => {
  const CategoryButton = ({ id, name, isSelected }) => (
    <button
      onClick={() => onCategoryClick(id)}
      className={`px-5 py-3 min-h-[40px] rounded-full font-semibold transition-all duration-300 whitespace-nowrap ${
        isSelected
          ? "bg-red-400 text-white shadow-lg"
          : "bg-gray-700 hover:bg-red-300 text-gray-200"
      }`}
    >
      {name}
    </button>
  );

  return (
    <div className="w-full max-w-3xl px-4 mb-4">
      <div className="flex space-x-2 overflow-x-auto pb-4 border-b border-gray-600 scrollbar-hide">
        <CategoryButton
          id="All"
          name="All"
          isSelected={selectedCategory === "All"}
        />
        {categories.map((category) => (
          <CategoryButton
            key={category.id}
            id={category.id}
            name={category.name}
            isSelected={selectedCategory === category.id}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoriesBar;