import React, {useEffect, useState} from 'react'
import { useHistory  } from 'react-router'
import axios from "axios"


const PLAYLISTS_ENDPOINT = "https://api.spotify.com/v1/me/playlists"

const AllPlaylistsPage = () => {
    const [playlists, setPlaylists] = useState({})
    const [token, setToken] = useState("")
    const history = useHistory()

    useEffect(() => {
        if (token === "") {
            if (localStorage.getItem("accessToken")) {
                setToken(localStorage.getItem("accessToken"))
            }
        } else {
            axios.get(PLAYLISTS_ENDPOINT, {
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

    const pushToSongsPage = (event, playlist) => {
        event.preventDefault()
        history.push({
            pathname: `/playlists/${playlist.id}`,
            state: {id: playlist.id, name: playlist.name}
        })
    }

    return(
        <div>
            <button onClick={e => pushToSongsPage(e, 
                {
                    id: 'likedsongs',
                    name: 'Liked Songs'
                })
                }>
                Liked Songs
            </button>
            {playlists.items && 
             playlists.items.map((playlist, idx) => {
                return(
                    <button 
                        key={idx} 
                        onClick={e => pushToSongsPage(e, playlist)} > 
                        {playlist.name} 
                    </button>)
            })}
        </div>
    )
}

export default AllPlaylistsPage