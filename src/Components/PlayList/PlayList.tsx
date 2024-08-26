import React from "react";
import styles from "./PlayList.module.css";

interface PlayListProps {
  children: React.ReactElement;
  name: string;

  handleNameChange: (value: string) => void;
  handlePost: () => void;

}

const PlayList: React.FC<PlayListProps> = ({
  children,
  name,

  handleNameChange: onChange,
  handlePost: onClick,

}) => {
  return (
    <div className={styles.wrapper}>
      <input
        className={styles.playlistName}
        type="text"
        value={name}
        onChange={(e) => onChange(e.target.value)}
      />
      {children}
      <button className={styles.button} onClick={onClick}>
        SAVE TO SPOTIFY
      </button>
    </div>
  );
};

export default PlayList;
