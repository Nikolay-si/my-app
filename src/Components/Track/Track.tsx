import { useRef, useState } from "react";
import React from "react";
import styles from "./Track.module.css";
import playIcon from "../../img/play_arrow_32dp_FFFFFF_FILL0_wght500_GRAD200_opsz48.svg";
import stopIcon from "../../img/pause_32dp_FFFFFF_FILL0_wght500_GRAD200_opsz48.svg";
interface TrackProps {
  title: string;
  artist: string[];
  id: string;
  onClick: () => void;
  buttonSymb: string;
  album: string;
  image: string;
  preview_url: string;
}

const Track: React.FC<TrackProps> = ({
  title,
  artist,
  id,
  onClick,
  buttonSymb,
  album,
  image,
  preview_url,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleImageClick = () => {
    if (audioRef.current && preview_url) {
      if (audioRef.current.paused) {
        audioRef.current.play();
        setIsPlaying(true);
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    } else {
      alert("No preview for this track");
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.preview}>

        <img className={styles.albumImage} src={image} />
        <div className={styles.icon}>
          {!isPlaying ? (
            <img onClick={handleImageClick} src={playIcon} />
          ) : (
            <img onClick={handleImageClick} src={stopIcon} />

          )}
        </div>
        <div className={styles.info}>
          <h3>{title}</h3>

          <div className={styles.album}>
            <p>{artist.join(", ")}</p>
            <p>| {album}</p>
          </div>
        </div>
      </div>
      <audio ref={audioRef} src={preview_url} />
      <button onClick={onClick} className={styles.button}>
        {buttonSymb}
      </button>
    </div>
  );
};

export default Track;
