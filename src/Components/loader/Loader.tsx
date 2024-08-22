import React from "react";
import styles from "./Loader.module.css"


const Loader: React.FC = () => {
    return (
        <div className={styles.hourglass}></div>
    )
}
export default Loader;