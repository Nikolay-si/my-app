import React, { useState, useEffect } from 'react';
import styles from "./App.module.css";
import SearchBar from './Components/searchBar/searchBar';
import TrackList from './Components/TtrackList/TrackList';
import SearchResult from './Components/SearchResults/SearchResult';
import PlayList from './Components/PlayList/PlayList';


import { spotifyAuth } from './Auth';

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
  }
}
interface ApiSong {
  id: string;
  name: string;
  artists: { name: string }[];
  uri: string;
  album: {
    name: string,
    images: { url: string }[];
  };
  preview_url: string;

}


function App() {

  const [songsList, setSongsList] = useState<Song[]>([]);
  const [userPlayList, setUserPlayList] = useState<Song[]>([]);
  const [playListName, setPlayListName] = useState("Your Playlist");
  const [query, setQuery] = useState("")
  const buttomSynbDel = "x";
  const buttomSynbAdd = "+";
  const playListTracksId = userPlayList.map(track => track.id);
  useEffect(() => {

    const token = spotifyAuth.getAccessToken();

    if (token) {

      console.log("Acess Token:", token)
    }
  }, [])


  function handleClick(song: Song) {
    if (!userPlayList.some(item => item.id === song.id)) {
      setUserPlayList([...userPlayList, song]);
      const nextSongList = songsList.filter(item => item.id !== song.id)
      setSongsList(nextSongList)
    }
  }

  function handleNameChange(value: string) {
    setPlayListName(value);
  }

  function handleDelet(song: Song) {
    const nextPlayList = userPlayList.filter(item => item.id !== song.id)
    setUserPlayList(nextPlayList)
  }
  function handleSubmit(): string[] {
    return userPlayList.map(song => song.uri);
  }
  function handleTextChange(value: string) {
    setQuery(value)
  }
  async function handleSearch() {
    const token = spotifyAuth.getAccessToken();
    if (!token) {
      console.error("No acess token availible");
      return;
    }

    try {
      const response = await fetch(`https://api.spotify.com/v1/search?type=track&q=${query}&limit=15`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data: ApiResponse = await response.json();
      const tracks = data.tracks.items;
      const formattedTracks: Song[] = tracks.map((track: ApiSong) => ({
        id: track.id,
        name: track.name,
        artists: track.artists.map(artist => artist.name),
        uri: track.uri,
        album: track.album.name,
        image: track.album.images[2].url,
        preview_url: track.preview_url,
      }))
      const trackToDisplay = formattedTracks.filter(track =>
        !playListTracksId.includes(track.id)
      );
      setSongsList(trackToDisplay)
      console.log(data.tracks.items)
    } catch (error) {
      console.error("Error fetching tracks:", error)
    }
  }

  async function handlePost() {
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

      const responsePlaylist = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
        method: `POST`,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: playListName,
          description: "Custom playlist",
          public: true,
        })
      })
      if (!responsePlaylist.ok) {
        throw new Error(`Error: ${responsePlaylist.status}`)
      }
      const dataPlayList = await responsePlaylist.json();
      const playListId = dataPlayList.id;
      const trackUris = handleSubmit();
      const responsePost = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playListId}/tracks`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "uris": trackUris,
          "position": 0
        })
      })
      if (!responsePost.ok) {
        throw new Error(`Error: ${responsePost.status}`)
      }
    } catch (error) {
      console.error(`Error`, error)
    }
  }

  return (
    <div>
      <header className={styles.header}><h1><span className={styles.boom}>Boom</span><img className={styles.headerImage} src='https://i.ibb.co/gS5cZwN/istockphoto-842671590-2048x2048.png' />box</h1></header>
      <div className={styles.main}>
        <SearchBar value={query} onChange={handleTextChange} onSearch={handleSearch} />
        <div className={styles.lay}>
          <SearchResult >
            <TrackList songsList={songsList}
              handleClick={handleClick}
              buttonSymb={buttomSynbAdd} />
          </SearchResult>
          <PlayList name={playListName} onChange={handleNameChange} onClick={handlePost}>
            <TrackList songsList={userPlayList}
              handleClick={handleDelet}
              buttonSymb={buttomSynbDel} />
          </PlayList>

        </div>

      </div>
    </div>
  );
}

export default App;
