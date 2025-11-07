import React from "react";

const SearchBar = ({ onSearch, onCategoryChange }) => {
  const categories = [
    "All",
    "Tools",
    "Kitchen",
    "Sports",
    "Books",
    "Electronics",
  ];

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search for items (e.g., 'drill', 'book', 'tent')..."
        onChange={(e) => onSearch(e.target.value)}
        className="search-input"
      />

      <select
        onChange={(e) => onCategoryChange(e.target.value)}
        className="category-select"
      >
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SearchBar;
