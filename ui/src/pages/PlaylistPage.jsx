import React, {useEffect, useState} from 'react'
import PropTypes from 'prop-types';
import { useHistory, useLocation } from 'react-router'
import axios from "axios"


const PlaylistPage = (props) => {
    const [playlist, setPlaylist] = useState({})
    const [token, setToken] = useState("")
    const location = useLocation()
    const history = useHistory()

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
                console.log(res.data)
                setPlaylist(res.data)
            }).catch((e) => {
                console.error(`COULD NOT RETRIEVE USER PLAYLISTS. ${e}`)
            })
        }
    }, [token])

    return(
        <div>
            <h1> {location.state.name} </h1>
            {playlist.items && playlist.items.map((song, idx) => {
                return(<p>{song.track.name}</p>)
            })}
        </div>
    )
    
}

export default PlaylistPage