import React from "react";
import styles from "./searchResult.module.css";


interface SearchResultProps {
    children: React.ReactNode,
    
}

const SearchResult: React.FC<SearchResultProps> = ({children}) => {
    return (
        <div className={styles.wrapper}>
            <h2>Results</h2>
            {children}
        </div>
    )
}

export default SearchResult;