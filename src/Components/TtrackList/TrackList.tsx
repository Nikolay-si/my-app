import React, { useState } from "react";

import styles from "./TrackList.module.css";
import Track from "../Track/Track";
import { SongsMap } from "../../App";
interface TrackListProps {
  searchResultId: string[];
  handleDelete: (id: string) => void;
  buttonSymb: string;
  songsMap: SongsMap;
}

const TrackList: React.FC<TrackListProps> = ({
  searchResultId,
  handleDelete: handleClick,
  buttonSymb,
  songsMap,
}) => {
  return (
    <div>
      <ul className={styles.trackList}>
        {searchResultId.map((id) => (
          <li key={id}>
            <Track
              id={id}
              title={songsMap[id].name}
              artist={songsMap[id].artists}
              onClick={() => handleClick(id)}
              buttonSymb={buttonSymb}
              album={songsMap[id].album}
              image={songsMap[id].image}
              preview_url={songsMap[id].preview_url}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TrackList;
