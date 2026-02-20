import React from "react";

const CategoriesBar = ({ categories, selectedCategory, onCategoryClick }) => {
  const CategoryButton = ({ id, name, isSelected }) => (
    <button
      onClick={() => onCategoryClick(id)}
      className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all sm:text-base ${
        isSelected
          ? "border border-red-400/40 bg-red-500 text-white shadow-[0_8px_22px_rgba(239,68,68,0.35)]"
          : "border border-white/10 bg-slate-900/70 text-slate-300 hover:border-red-300/30 hover:bg-slate-800 hover:text-white"
      }`}
    >
      {name}
    </button>
  );

  return (
    <div className="relative mb-6 w-full max-w-4xl px-1">
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-8 bg-gradient-to-r from-[#090b12] to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-8 bg-gradient-to-l from-[#090b12] to-transparent" />

      <div className="scrollbar-hide flex space-x-3 overflow-x-auto px-2 pb-2">
        <CategoryButton id="All" name="All" isSelected={selectedCategory === "All"} />
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

