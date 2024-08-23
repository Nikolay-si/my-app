import React from "react";
import styles from "./searchBar.module.css";

interface SearchBarProps {
  value: string;
  handleTextChange: (value: string) => void;
  handleSearch: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  handleTextChange: onChange,
  handleSearch: onSearch,
}) => {
  return (
    <div className={styles.searchBar}>
      <input
        className={styles.searchBar__input}
        value={value}
        type="text"
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter a song Title"
      />
      <button
        className={styles.searchBar__button}
        type="button"
        onClick={onSearch}
      >
        SEARCH
      </button>
    </div>
  );
};

export default SearchBar;
