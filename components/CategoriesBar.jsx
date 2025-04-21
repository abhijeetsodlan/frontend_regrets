// src/components/CategoriesBar.jsx
import React from "react";

const CategoriesBar = ({ categories, selectedCategory, onCategoryClick }) => {
  const CategoryButton = ({ id, name, isSelected }) => (
    <button
      onClick={() => onCategoryClick(id)}
      className={`px-5 py-2 rounded-full text-sm sm:text-base font-medium transition-all whitespace-nowrap
        ${
          isSelected
            ? "bg-red-400 text-white shadow-md"
            : "bg-gray-800 text-gray-300 hover:bg-red-500 hover:text-white"
        }`}
    >
      {name}
    </button>
  );

  return (
    <div className="w-full max-w-4xl px-4 mb-6 relative">
      {/* Optional gradient fade for aesthetic */}
      <div className="absolute left-0 top-0 h-full w-8 bg-gradient-to-r from-gray-950 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-gray-950 to-transparent z-10 pointer-events-none" />

      <div className="flex space-x-3 overflow-x-auto scrollbar-hide px-2 pb-2">
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
