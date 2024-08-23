import React, { useState } from "react";

import styles from "./TrackList.module.css";
import Track from "../Track/Track";
import { Song } from "../../App";
interface TrackListProps {
  songsList: Song[];
  handleClick: (song: Song) => void;
  buttonSymb: string;
}

const TrackList: React.FC<TrackListProps> = ({
  songsList,
  handleClick,
  buttonSymb,
}) => {
  return (
    <div>
      <ul className={styles.trackList}>
        {songsList.map((song) => (
          <li key={song.id}>
            <Track
              id={song.id}
              title={song.name}
              artist={song.artists}
              onClick={() => handleClick(song)}
              buttonSymb={buttonSymb}
              album={song.album}
              image={song.image}
              preview_url={song.preview_url}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TrackList;
