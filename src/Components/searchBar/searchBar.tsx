import React, {useState} from "react";
import "./searchBar.css"

interface SearchBarProps {
    value:string,
    onChange:(value: string) => void,
    onSearch:() => void,
}

const SearchBar:React.FC<SearchBarProps> =({value, onChange, onSearch}) => {
    
    
    return (
        <div
        
        className="searchBar"
        >
            <input 
            className="searchBar__input"
            value={value}
            type="text"
            onChange={(e) => onChange(e.target.value)}
            placeholder="Enter a song Title"
            />
            <button
            className="searchBar__button" 
            type="button"
            onClick={onSearch}>
                SEARCH
            </button>
        </div>

    )
}

export default SearchBar