import React from "react";
import { inflateRaw } from "zlib";
import styles from "./PlayList.module.css";

interface PlayListProps {
    children: React.ReactElement;
    name: string,
    onChange: (value:string) => void,
}

const PlayList:React.FC<PlayListProps> = ({children, name, onChange}) => {
    return (
        <div className={styles.wrapper}>
            <input className={styles.playlistName} type="text" value={name} onChange={(e) => onChange(e.target.value)}/>
            {children}
            <button className={styles.button}>SAVE TO SPOTIFY</button>
        </div>
    )
}

export default PlayList;