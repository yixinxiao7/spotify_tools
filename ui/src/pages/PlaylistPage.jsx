import React, {useEffect, useState} from 'react'
import { useLocation } from 'react-router'
import axios from "axios"

import SongQuickView from '../components/SongQuickView.jsx'

const PlaylistPage = () => {
    const [playlist, setPlaylist] = useState({})
    const [token, setToken] = useState("")
    const location = useLocation()

    const PLAYLIST_ENDPOINT = `https://api.spotify.com/v1/playlists/${location.state.id}/tracks`

    useEffect(() => {
        if (token === "") {
            if (localStorage.getItem("accessToken")) {
                setToken(localStorage.getItem("accessToken"))
            }
        } else {
            axios.get(PLAYLIST_ENDPOINT, {
                headers: {
                    Authorization: "Bearer " + token
                }
            }).then((res) => {
                setPlaylist(res.data)
            }).catch((e) => {
                console.error(`COULD NOT RETRIEVE USER PLAYLISTS. ${e}`)
            })
        }
    }, [token])

    const getSongArtists = (song) => {
        return song.track.artists.map((artist) => {
            return artist.name
        })
    }

    return(
        <div>
            <h1> {location.state.name} </h1>
            {playlist.items && playlist.items.map((song, idx) => {
                return(
                    <SongQuickView 
                        key={idx}
                        name={song.track.name}
                        artists={getSongArtists(song)}/>
                )
            })}
        </div>
    )
    
}

export default PlaylistPage