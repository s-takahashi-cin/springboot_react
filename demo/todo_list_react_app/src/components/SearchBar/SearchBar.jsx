import React from "react";
// import "./SearchBar.css"; 

const SearchBar = ({ searchTerm, setSearchTerm }) => {
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="search-container">
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        className="search-input"
        placeholder="タイトルを検索"
      />
    </div>
  );
};

export default SearchBar;
