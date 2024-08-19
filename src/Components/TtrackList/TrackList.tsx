import React, { useState } from "react";
import { Song } from "../Data/data";
import styles from "./TrackList.module.css"
import Track from "../Track/Track";

interface TrackListProps {
    songsList: Song[];
    handleClick: (song: Song) => void;
    buttonSymb: string,
}

const TrackList: React.FC<TrackListProps> = ({ songsList, handleClick,buttonSymb }) => {

    

    return (
        <div className="TrackList">
            <ul>
                {songsList.map((song) => (
                    <li className={styles.trackList} key={song.id}>
                        <Track
                            id={song.id}
                            title={song.name}
                            artist={song.artists}
                            onClick={() => handleClick(song)}
                            buttonSymb={buttonSymb} 
                            album={song.album}
                            />
                    </li>
                ))}
            </ul>
        </div>
    )
}


export default TrackList;