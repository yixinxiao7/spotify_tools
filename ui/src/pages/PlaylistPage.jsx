import React, {useEffect, useState} from 'react';
import axios from "axios";
const PLAYLIST_ENDPOINT = "	https://api.spotify.com/v1/me/playlists";

const PlaylistPage = () => {
    const [playlists, setPlaylists] = useState({})
    const [token, setToken] = useState("")

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
                setPlaylists(res.data)
            }).catch((e) => {
                console.error(`COULD NOT RETRIEVE USER PLAYLISTS. ${e}`)
            })
        }
    }, [token])

    return(
        <div>
            {playlists.items && 
             playlists.items.map((playlist, idx) => {
                return(<p key={idx}> {playlist.name} </p>)
            })}
        </div>
    )
}

export default PlaylistPage;