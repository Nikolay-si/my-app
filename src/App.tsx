import React, { useState, useEffect } from "react";
import styles from "./App.module.css";
import SearchBar from "./Components/searchBar/searchBar";
import TrackList from "./Components/TtrackList/TrackList";
import SearchResult from "./Components/SearchResults/SearchResult";
import PlayList from "./Components/PlayList/PlayList";
import Loader from "./Components/loader/Loader";

import { spotifyAuth } from "./Auth";

export interface Song {
  id: string;
  name: string;
  artists: string[];
  uri: string;
  album: string;
  image: string;
  preview_url: string;
}
interface ApiResponse {
  tracks: {
    items: ApiSong[];
  };
}
interface ApiSong {
  id: string;
  name: string;
  artists: { name: string }[];
  uri: string;
  album: {
    name: string;
    images: { url: string }[];
  };
  preview_url: string;
}
export interface SongsMap {
  [id: string]: Song;
}

function App() {
  const [songsMap, setSongsMap] = useState<SongsMap>({});
  const [searchResultId, setSearchResultId] = useState<string[]>([]);
  const [userPlayListId, setUserPlayListId] = useState<string[]>([]);
  const [playListName, setPlayListName] = useState("Your Playlist");
  const [query, setQuery] = useState("");
  const buttomSynbDel = "x";
  const buttomSynbAdd = "+";
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const token = spotifyAuth.getAccessToken();

    if (token) {
      console.log("Acess Token:", token);
    }
  }, []);

  function handleAddTrack(id: string) {
    if (!userPlayListId.some((playId) => playId === id)) {
      setUserPlayListId([...userPlayListId, id]);
      const nextSearchResultId = searchResultId.filter(
        (playId) => id !== playId
      );
      setSearchResultId(nextSearchResultId);
    }
  }

  function handleNameChange(value: string) {
    setPlayListName(value);
  }

  function handleDelete(id: string) {
    const nextPlayListId = userPlayListId.filter((playId) => playId !== id);
    setUserPlayListId(nextPlayListId);
  }
  function getTrackUrisForPlaylist(): string[] {
    return userPlayListId.map((id) => songsMap[id].uri);
  }
  function handleTextChange(value: string) {
    setQuery(value);
  }
  async function handleSearch() {
    const token = spotifyAuth.getAccessToken();
    if (!token) {
      console.error("No acess token availible");
      return;
    }

    try {
      const response = await fetch(
        `https://api.spotify.com/v1/search?type=track&q=${query}&limit=15`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data: ApiResponse = await response.json();
      const tracks = data.tracks.items;

      const formattedTracks = tracks.reduce((acc: SongsMap, track: ApiSong) => {
        acc[track.id] = {
          id: track.id,
          name: track.name,
          artists: track.artists.map((artist) => artist.name),
          uri: track.uri,
          album: track.album.name,
          image: track.album.images[2].url,
          preview_url: track.preview_url,
        };
        return acc;
      }, {});
      console.log(formattedTracks);
      setSongsMap(formattedTracks);
      const searchResponse = tracks.map((track) => track.id);
      const searchDisplayed = searchResponse.filter(
        (id) => !userPlayListId.includes(id)
      );
      setSearchResultId(searchDisplayed);
      console.log(data.tracks.items);
    } catch (error) {
      console.error("Error fetching tracks:", error);
    }
  }

  async function handlePost() {
    setIsLoading(true);
    const token = spotifyAuth.getAccessToken();
    if (!token) {
      console.error("No acess token availible");
      return;
    }
    try {
      const response = await fetch(`https://api.spotify.com/v1/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      const userId = data.id;

      const responsePlaylist = await fetch(
        `https://api.spotify.com/v1/users/${userId}/playlists`,
        {
          method: `POST`,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: playListName,
            description: "Custom playlist",
            public: true,
          }),
        }
      );
      if (!responsePlaylist.ok) {
        throw new Error(`Error: ${responsePlaylist.status}`);
      }
      const dataPlayList = await responsePlaylist.json();
      const playListId = dataPlayList.id;
      const trackUris = getTrackUrisForPlaylist();
      const responsePost = await fetch(
        `https://api.spotify.com/v1/users/${userId}/playlists/${playListId}/tracks`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uris: trackUris,
            position: 0,
          }),
        }
      );
      if (!responsePost.ok) {
        throw new Error(`Error: ${responsePost.status}`);
      }
    } catch (error) {
      console.error(`Error`, error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <header className={styles.header}>
        <h1>
          <span className={styles.header__logo}>Boom</span>
          <img
            className={styles.header__image}
            src="https://i.ibb.co/gS5cZwN/istockphoto-842671590-2048x2048.png"
          />
          box
        </h1>
      </header>
      <div className={styles.main}>
        <SearchBar
          value={query}
          handleTextChange={handleTextChange}
          handleSearch={handleSearch}
        />
        <div className={styles.lay}>
          <SearchResult>
            <TrackList
              songsMap={songsMap}
              searchResultId={searchResultId}
              handleDelete={handleAddTrack}
              buttonSymb={buttomSynbAdd}
            />
          </SearchResult>
          <PlayList
            name={playListName}
            handleNameChange={handleNameChange}
            handlePost={handlePost}
          >
            {!isLoading ? (
              <TrackList
                songsMap={songsMap}
                searchResultId={userPlayListId}
                handleDelete={handleDelete}
                buttonSymb={buttomSynbDel}
              />
            ) : (
              <Loader />
            )}
          </PlayList>
        </div>
      </div>
    </div>
  );
}

export default App;
