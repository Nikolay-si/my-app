import React from "react";
import styles from "./Track.module.css"

interface TrackProps {
    title: string,
    artist: string,
    id: string,
    onClick: () => void,
    buttonSymb: string,
    album: string,
}


const Track: React.FC<TrackProps> = ({title, artist, id, onClick, buttonSymb, album}) => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.info}>
                <div>
                    <h3>{title}</h3>
                </div>
                <div className={styles.albom}>
                    <p>{artist}</p>
                    <p>| {album}</p>
                </div>
            </div>
            <div>
                <button 
                onClick={onClick}
                className={styles.button}>{buttonSymb}</button>
            </div>
        </div>
    )
}

export default Track;